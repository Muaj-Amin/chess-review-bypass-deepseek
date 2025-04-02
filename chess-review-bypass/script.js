document.addEventListener('DOMContentLoaded', function() {
    const gameUrlInput = document.getElementById('gameUrl');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');
    const analysisFrame = document.getElementById('analysisFrame');

    analyzeBtn.addEventListener('click', function() {
        const gameUrl = gameUrlInput.value.trim();
        
        if (!gameUrl) {
            alert('Please enter a Chess.com game URL');
            return;
        }
        
        // Validate URL format
        if (!isValidChessComUrl(gameUrl)) {
            alert('Please enter a valid Chess.com game URL');
            return;
        }
        
        // Show loading, hide other states
        loadingDiv.classList.remove('hidden');
        resultDiv.classList.add('hidden');
        errorDiv.classList.add('hidden');
        
        // Extract game ID from URL
        const gameId = extractGameId(gameUrl);
        
        // Call backend to analyze the game
        analyzeGame(gameId);
    });
    
    function isValidChessComUrl(url) {
        return url.includes('chess.com/game/');
    }
    
    function extractGameId(url) {
        // Extract the last part of the URL which should be the game ID
        const parts = url.split('/');
        return parts[parts.length - 1];
    }
    
    function analyzeGame(gameId) {
        // In a real implementation, this would call your backend
        // For this demo, we'll simulate it with a timeout
        
        // This would be a fetch to your backend in a real implementation:
        // fetch(`/analyze?gameId=${gameId}`)
        //     .then(response => response.json())
        //     .then(data => {
        //         if (data.success) {
        //             showAnalysis(data.analysisUrl);
        //         } else {
        //             showError();
        //         }
        //     })
        //     .catch(showError);
        
        // Simulate network request
        setTimeout(() => {
            loadingDiv.classList.add('hidden');
            
            // In a real implementation, the backend would return the analysis URL
            // For this demo, we'll construct it directly
            const analysisUrl = `https://www.chess.com/analysis/game/live/${gameId}?tab=review`;
            
            showAnalysis(analysisUrl);
        }, 2000);
    }
    
    function showAnalysis(analysisUrl) {
        analysisFrame.src = analysisUrl;
        resultDiv.classList.remove('hidden');
    }
    
    function showError() {
        loadingDiv.classList.add('hidden');
        errorDiv.classList.remove('hidden');
    }
});
