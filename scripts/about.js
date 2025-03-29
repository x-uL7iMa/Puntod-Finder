// Add event listeners to FAQ questions
document.addEventListener('DOMContentLoaded', () => {
    const questions = document.querySelectorAll('.faq-question'); // Select all FAQ questions
    questions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling; // Get the corresponding answer
            // Toggle the display of the answer
            answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
        });
    });
});