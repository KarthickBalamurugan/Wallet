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

  const validatePaymentLink = async (link) => {
    try {
      // API endpoint would go here
      const response = await fetch('', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any required authentication headers
          // 'Authorization': 'Bearer YOUR_TOKEN'
        },
        body: JSON.stringify({ paymentLink: link })
      });

      if (!response.ok) {
        throw new Error('Validation request failed');
      }

      const data = await response.json();
      return data.isValid; // Assuming API returns { isValid: boolean }
    } catch (error) {
      console.error('Validation error:', error);
      throw error;
    }
  };

  const handleValidation = async (e) => {
    e.preventDefault();
    setIsValidating(true);
    setErrorMessage('');
    
    try {
      const isValid = await validatePaymentLink(paymentLink);
      setValidationResult(isValid);
      
      // Animation for validation result
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
    } catch (error) {
      setErrorMessage('Failed to validate link. Please try again.');
      setValidationResult(false);
    } finally {
      setIsValidating(false);
    }
  };

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
                  ) : 'Validate Link'}
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
                      ? 'Valid payment link' 
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