document.addEventListener('DOMContentLoaded', function() {
    
    const title = document.querySelector('h1');
    if (title) {
        const originalText = title.textContent;
        title.textContent = '';
        
        let i = 0;
        const typingEffect = setInterval(() => {
            if (i < originalText.length) {
                title.textContent += originalText.charAt(i);
                i++;
            } else {
                clearInterval(typingEffect);
            }
        }, 150);
    }

   
    const buttons = document.querySelectorAll('.auth-button');
    buttons.forEach((button, index) => {
        button.style.animation = `fadeIn 0.5s ease forwards ${index * 0.2 + 0.5}s`;
        button.style.opacity = '0';
    });

    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.querySelector('i').style.transform = 'scale(1.1)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.querySelector('i').style.transform = 'scale(1)';
        });
    });
});
