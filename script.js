document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const toggleButton = document.getElementById('toggle-password');
    const strengthBar = document.getElementById('strength-bar');
    const strengthValue = document.getElementById('strength-value');
    const lengthCriterion = document.getElementById('length');
    const uppercaseCriterion = document.getElementById('uppercase');
    const lowercaseCriterion = document.getElementById('lowercase');
    const numberCriterion = document.getElementById('number');
    const specialCriterion = document.getElementById('special');
    const feedbackText = document.getElementById('feedback-text');
    const submitButton = document.getElementById('submit-password');

    // Toggle password visibility
    toggleButton.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleButton.textContent = 'Hide';
        } else {
            passwordInput.type = 'password';
            toggleButton.textContent = 'Show';
        }
    });

    // Check password strength on input
    passwordInput.addEventListener('input', checkPasswordStrength);
    
    // Submit password to server
    submitButton.addEventListener('click', submitPassword);

    function checkPasswordStrength() {
        const password = passwordInput.value;
        
        // Check criteria
        const hasLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[^A-Za-z0-9]/.test(password);
        
        // Update criteria UI
        updateCriterion(lengthCriterion, hasLength);
        updateCriterion(uppercaseCriterion, hasUppercase);
        updateCriterion(lowercaseCriterion, hasLowercase);
        updateCriterion(numberCriterion, hasNumber);
        updateCriterion(specialCriterion, hasSpecial);
        
        // Calculate strength score (0-100)
        let strengthScore = calculateStrengthScore(password, hasLength, hasUppercase, hasLowercase, hasNumber, hasSpecial);
        
        // Update strength bar
        strengthBar.style.width = `${strengthScore}%`;
        
        // Remove previous classes
        strengthBar.classList.remove('very-weak', 'weak', 'medium', 'strong', 'very-strong');
        
        // Set strength level
        let strengthLevel;
        if (strengthScore === 0) {
            strengthLevel = 'None';
        } else if (strengthScore <= 20) {
            strengthLevel = 'Very Weak';
            strengthBar.classList.add('very-weak');
        } else if (strengthScore <= 40) {
            strengthLevel = 'Weak';
            strengthBar.classList.add('weak');
        } else if (strengthScore <= 60) {
            strengthLevel = 'Medium';
            strengthBar.classList.add('medium');
        } else if (strengthScore <= 80) {
            strengthLevel = 'Strong';
            strengthBar.classList.add('strong');
        } else {
            strengthLevel = 'Very Strong';
            strengthBar.classList.add('very-strong');
        }
        
        strengthValue.textContent = strengthLevel;
        
        // Generate feedback
        generateFeedback(password, hasLength, hasUppercase, hasLowercase, hasNumber, hasSpecial, strengthLevel);
    }

    function updateCriterion(element, isValid) {
        if (isValid) {
            element.classList.add('valid');
        } else {
            element.classList.remove('valid');
        }
    }

    function calculateStrengthScore(password, hasLength, hasUppercase, hasLowercase, hasNumber, hasSpecial) {
        if (password.length === 0) {
            return 0;
        }
        
        let score = 0;
        
        // Basic criteria (50% of score)
        if (hasLength) score += 10;
        if (hasUppercase) score += 10;
        if (hasLowercase) score += 10;
        if (hasNumber) score += 10;
        if (hasSpecial) score += 10;
        
        // Length bonus (up to 25%)
        const lengthScore = Math.min(25, Math.floor(password.length * 2.5));
        score += lengthScore;
        
        // Complexity bonus (up to 25%)
        const varietyCount = [hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;
        score += varietyCount * 6.25;
        
        // Penalty for repeating patterns
        if (/(.)\1\1/.test(password)) { // Three or more same characters in a row
            score -= 10;
        }
        
        // Penalty for sequential characters
        if (/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789/i.test(password)) {
            score -= 10;
        }
        
        return Math.max(0, Math.min(100, score));
    }

    function generateFeedback(password, hasLength, hasUppercase, hasLowercase, hasNumber, hasSpecial, strengthLevel) {
        if (password.length === 0) {
            feedbackText.textContent = 'Enter a password to receive feedback.';
            return;
        }
        
        let feedback = '';
        
        // Provide specific feedback based on missing criteria
        const missingCriteria = [];
        if (!hasLength) missingCriteria.push('at least 8 characters');
        if (!hasUppercase) missingCriteria.push('an uppercase letter');
        if (!hasLowercase) missingCriteria.push('a lowercase letter');
        if (!hasNumber) missingCriteria.push('a number');
        if (!hasSpecial) missingCriteria.push('a special character');
        
        if (missingCriteria.length > 0) {
            feedback += `Your password is missing: ${missingCriteria.join(', ')}. `;
        }
        
        // Additional feedback based on strength
        switch (strengthLevel) {
            case 'Very Weak':
                feedback += 'This password could be easily cracked. ';
                break;
            case 'Weak':
                feedback += 'This password is still quite weak. ';
                break;
            case 'Medium':
                feedback += 'This password provides moderate security. ';
                break;
            case 'Strong':
                feedback += 'This is a good password! ';
                break;
            case 'Very Strong':
                feedback += 'Excellent password choice! ';
                break;
        }
        
        // Suggestions for improvement
        if (password.length < 12) {
            feedback += 'Consider using a longer password for better security. ';
        }
        
        if (/(.)\1\1/.test(password)) {
            feedback += 'Avoid using repeating characters. ';
        }
        
        if (/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789/i.test(password)) {
            feedback += 'Avoid sequential characters. ';
        }
        
        if (password.toLowerCase().includes('password') || password.toLowerCase().includes('123456')) {
            feedback += 'Your password contains common patterns that are easily guessed. ';
        }
        
        feedbackText.textContent = feedback.trim();
    }
    
    function submitPassword() {
        const password = passwordInput.value;
        if (!password) {
            alert('Please enter a password first');
            return;
        }
        
        // Create a WebSocket connection to the Java server
        const socket = new WebSocket('ws://localhost:8080');
        
        socket.onopen = function() {
            console.log('Connected to server');
            socket.send(password);
        };
        
        socket.onmessage = function(event) {
            console.log('Message from server:', event.data);
            alert(event.data);
            socket.close();
        };
        
        socket.onerror = function(error) {
            console.error('WebSocket error:', error);
            alert('Error connecting to server. Make sure the Java server is running.');
        };
    }
}); 