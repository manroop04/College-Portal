import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '../components/ui/button';
import Sidebar from '../components/ui/Sidebar';
import profileImg from '../assets/profile.png';
import logo from '../assets/logo.png';
import '../styles/Inbox.css';

interface Email {
  id: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
}

interface EmailContent {
  id: string;
  body: {
    html?: string;
    text?: string;
  };
}

interface AuthCodeResponse {
  code: string;
}

interface TokenData {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
}

const Inbox: React.FC = () => {
  const [student] = useState({
    id: '1',
    name: 'John Smith',
    profileImage: profileImg,
  });

  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmailContent, setSelectedEmailContent] = useState<EmailContent | null>(null);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState('');

  const fetchWithTimeout = async (url: string, options: RequestInit, timeout = 10000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  };

  const fetchEmailContent = async (emailId: string) => {
    try {
      setContentLoading(true);
      setError(null);
      
      const response = await fetchWithTimeout(
        `http://localhost:5000/api/emails/${emailId}/content`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        },
        15000
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      const contentData = await response.json();
      setSelectedEmailContent(contentData);
      setSelectedEmailId(emailId);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Email content fetch failed:', err);
      setError(errorMessage);
    } finally {
      setContentLoading(false);
    }
  };

  const fetchEmails = async (token: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchWithTimeout('http://localhost:5000/api/emails', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }, 15000);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      const emailData = await response.json();
      
      if (!Array.isArray(emailData)) {
        throw new Error('Invalid response format - expected array');
      }

      setEmails(emailData);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Email fetch failed:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (codeResponse: AuthCodeResponse) => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            code: codeResponse.code,
            redirect_uri: window.location.origin
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const tokenData: TokenData = await response.json();
        
        if (!tokenData.access_token) {
          throw new Error('No access token received from server');
        }

        localStorage.setItem('google_auth', JSON.stringify({
          token: tokenData.access_token,
          expires_at: Date.now() + (tokenData.expires_in * 1000),
          refresh_token: tokenData.refresh_token || null
        }));
        
        setAccessToken(tokenData.access_token);
        setIsAuthenticated(true);
        await fetchEmails(tokenData.access_token);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Login failed';
        console.error('Login error:', err);
        setError(errorMsg);
      }
    },
    onError: (errorResponse) => {
      console.error('Google authentication error:', errorResponse);
      setError('Google authentication failed');
    },
    scope: 'https://www.googleapis.com/auth/gmail.readonly',
    flow: 'auth-code',
    redirect_uri: window.location.origin
  });

  const handleLogout = () => {
    localStorage.removeItem('google_auth');
    setIsAuthenticated(false);
    setEmails([]);
    setAccessToken('');
    setSelectedEmailContent(null);
    setSelectedEmailId(null);
    setError(null);
  };

  const filteredEmails = emails.filter((email) => {
    if (!email.subject) return false;
    
    const subject = email.subject.toLowerCase();
    switch (activeTab) {
      case 'mess':
        return subject.includes('mess') || subject.includes('food') || subject.includes('dining');
      case 'internship':
        return subject.includes('internship') || subject.includes('job') || subject.includes('career');
      case 'exam':
        return subject.includes('exam') || subject.includes('semester') || subject.includes('schedule');
      case 'hostel':
        return subject.includes('hostel') || subject.includes('committee');
      default:
        return true;
    }
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const authDataStr = localStorage.getItem('google_auth');
      if (!authDataStr) return;

      const authData = JSON.parse(authDataStr);
      const isValid = authData.token && authData.expires_at > Date.now();

      if (isValid) {
        setIsAuthenticated(true);
        setAccessToken(authData.token);
        await fetchEmails(authData.token);
      } else {
        handleLogout();
      }
    };

    initializeAuth();
  }, []);

  const renderEmailDetail = () => {
    if (!selectedEmailId || !selectedEmailContent) return null;
    
    const email = emails.find(e => e.id === selectedEmailId);
    if (!email) return null;
    
    return (
      <div className="email-detail-container">
        <Button 
          className="back-button"
          onClick={() => {
            setSelectedEmailContent(null);
            setSelectedEmailId(null);
          }}
        >
          ← Back to Inbox
        </Button>
        
        <div className="email-header">
          <h2>{email.subject}</h2>
          <div className="email-meta">
            <div><strong>From:</strong> {email.from}</div>
            <div><strong>Date:</strong> {new Date(email.date).toLocaleString()}</div>
          </div>
        </div>
        
        {contentLoading ? (
          <div className="loading-message">Loading email content...</div>
        ) : (
          <div className="email-content">
            {selectedEmailContent.body?.html ? (
              <div 
                dangerouslySetInnerHTML={{ __html: selectedEmailContent.body.html }} 
                className="email-html-content"
              />
            ) : (
              <pre className="email-text-content">
                {selectedEmailContent.body?.text || 'No content available'}
              </pre>
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) return (
    <div className="main-content">
      <Sidebar student={student} activePage="inbox" />
      <div className="content">
        <header className="page-header">
          <h1>College Inbox</h1>
          <img src={logo} alt="Logo" className="header-logo" />
        </header>
        <div className="loading-message">Loading emails...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="main-content">
      <Sidebar student={student} activePage="inbox" />
      <div className="content">
        <header className="page-header">
          <h1>College Inbox</h1>
          <img src={logo} alt="Logo" className="header-logo" />
        </header>
        <div className="error-message">
          Error: {error}
          {!isAuthenticated && (
            <Button className="login-button" onClick={() => login()}>
              Sign in with Google
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="main-content">
      <Sidebar student={student} activePage="inbox" />
      
      <div className="content">
        <header className="page-header">
          <h1>Student</h1>
          {isAuthenticated ? (
            <div className="header-actions">
              <img src={logo} alt="Logo" className="header-logo" />
              <Button className="logout-button" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <img src={logo} alt="Logo" className="header-logo" />
          )}
        </header>

        <div className="inbox-container">
          {selectedEmailId ? (
            renderEmailDetail()
          ) : (
            <>
              {!isAuthenticated ? (
                <div className="auth-prompt">
                  <h2>Sign in to access your college emails</h2>
                  <Button className="login-button" onClick={() => login()}>
                    Sign in with Google
                  </Button>
                </div>
              ) : (
                <>
                  <div className="inbox-tabs">
                    <Button 
                      className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
                      onClick={() => setActiveTab('all')}
                    >
                      All Emails
                    </Button>
                    <Button 
                      className={`tab-button ${activeTab === 'mess' ? 'active' : ''}`}
                      onClick={() => setActiveTab('mess')}
                    >
                      Mess
                    </Button>
                    <Button 
                      className={`tab-button ${activeTab === 'internship' ? 'active' : ''}`}
                      onClick={() => setActiveTab('internship')}
                    >
                      Internship
                    </Button>
                    <Button 
                      className={`tab-button ${activeTab === 'exam' ? 'active' : ''}`}
                      onClick={() => setActiveTab('exam')}
                    >
                      Exam
                    </Button>
                    <Button 
                      className={`tab-button ${activeTab === 'hostel' ? 'active' : ''}`}
                      onClick={() => setActiveTab('hostel')}
                    >
                      Hostel
                    </Button>
                  </div>

                  <div className="email-list">
                    {filteredEmails.length === 0 ? (
                      <div className="no-emails-message">
                        No emails found in {activeTab} category
                      </div>
                    ) : (
                      filteredEmails.map((email) => (
                        <div 
                          key={email.id} 
                          className="email-item"
                          onClick={() => fetchEmailContent(email.id)}
                        >
                          <div className="email-item-header">
                            <h3>{email.subject || 'No Subject'}</h3>
                            <span className="email-date">
                              {new Date(email.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="email-from">{email.from || 'Unknown'}</div>
                          <div className="email-snippet">
                            {email.snippet || 'No snippet available'}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inbox;