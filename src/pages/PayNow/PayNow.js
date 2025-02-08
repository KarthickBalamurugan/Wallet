import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faCheckCircle, faTimesCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import './PayNow.css';
import gsap from 'gsap';
import PageTransition from '../../components/PageTransition';

function PayNow() {
  const [paymentLink, setPaymentLink] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const headerRef = useRef(null);
  const formRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(containerRef.current,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 0.5,
      }
    )
    .fromTo(headerRef.current,
      {
        y: -50,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
      }
    )
    .fromTo(cardRef.current,
      {
        y: 50,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
      },
      "-=0.3"
    );

    return () => tl.kill();
  }, []);

  // Link validation function
  async function validateLink(url) {
    try {
      const response = await fetch('http://localhost:3000/api/check-phishing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        isValid: !data.isPhishing, // assuming API returns isPhishing boolean
        message: data.message || 'Link validation complete'
      };
    } catch (error) {
      console.error('Error validating link:', error);
      throw new Error('Failed to validate link: ' + error.message);
    }
  }

  const handleValidation = async (e) => {
    e.preventDefault();
    setIsValidating(true);
    setErrorMessage('');
    
    try {
      const result = await validateLink(paymentLink);
      console.log('Validation result:', result); // Debug log
      
      if (result.isValid) {
        setValidationResult(true);
        // Handle successful validation
        gsap.fromTo('.validation-message',
          {
            opacity: 0,
            y: 20
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out"
          }
        );
      } else {
        setValidationResult(false);
        setErrorMessage(result.message || 'Invalid payment link');
      }
    } catch (error) {
      console.error('Validation error:', error);
      setValidationResult(false);
      setErrorMessage('Failed to validate link. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  // Example validation check on component mount
  useEffect(() => {
    // Test the validation with an example URL
    const testValidation = async () => {
      try {
        const urlToValidate = 'https://example.com';
        const result = await validateLink(urlToValidate);
        console.log('Initial validation test:', result);
      } catch (error) {
        console.error('Test validation error:', error);
      }
    };

    testValidation();
  }, []);

  return (
    <PageTransition>
      <div className="page-wrapper" ref={containerRef}>
        <div className="page-container">
          <div className="page-content" ref={contentRef}>
            <div className="section-header" ref={headerRef}>
              <h2>Pay Now</h2>
              <p>Validate and process your payment links securely</p>
            </div>

            <div className="payment-card" ref={cardRef}>
              <form ref={formRef} onSubmit={handleValidation}>
                <div className="input-group">
                  <FontAwesomeIcon icon={faLink} className="input-icon" />
                  <input
                    type="url"
                    value={paymentLink}
                    onChange={(e) => setPaymentLink(e.target.value)}
                    placeholder="Enter payment link"
                    required
                    pattern="https?://.*"
                    title="Please enter a valid URL starting with http:// or https://"
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="validate-button"
                  disabled={isValidating}
                >
                  {isValidating ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin /> 
                      Validating...
                    </>
                  ) : 'Pay Now'}
                </button>
              </form>

              {(validationResult !== null || errorMessage) && (
                <div 
                  className={`validation-message ${validationResult ? 'success' : 'error'}`}
                >
                  <FontAwesomeIcon 
                    icon={validationResult ? faCheckCircle : faTimesCircle} 
                  />
                  <span>
                    {errorMessage || (validationResult 
                      ? 'Valid payment link - Processing payment...' 
                      : 'Invalid payment link. Please check the format.')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default PayNow; 