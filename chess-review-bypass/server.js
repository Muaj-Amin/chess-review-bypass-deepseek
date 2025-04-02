const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Routes
app.get('/analyze', async (req, res) => {
    try {
        const gameId = req.query.gameId;
        
        if (!gameId) {
            return res.status(400).json({ success: false, error: 'Game ID is required' });
        }
        
        // First, check if the game is already reviewed
        const analysisUrl = `https://www.chess.com/analysis/game/live/${gameId}?tab=review`;
        
        // Check if review exists by making a HEAD request
        try {
            const response = await axios.head(analysisUrl);
            
            // If we get here, the review exists
            return res.json({ 
                success: true, 
                analysisUrl: analysisUrl,
                cached: true
            });
        } catch (error) {
            // If HEAD fails, we need to create the review
            
            // First get the game PGN
            const gameUrl = `https://www.chess.com/game/live/${gameId}`;
            const gameResponse = await axios.get(gameUrl);
            const $ = cheerio.load(gameResponse.data);
            
            // Extract PGN from the page
            const pgn = $('script#pgn').text() || $('script[data-pgn]').attr('data-pgn');
            
            if (!pgn) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Could not extract game data' 
                });
            }
            
            // Now submit the PGN to chess.com's analysis
            // This is a simplified version - in reality you'd need to properly simulate a user session
            const formData = new URLSearchParams();
            formData.append('pgn', pgn);
            
            const analysisResponse = await axios.post(
                'https://www.chess.com/callback/analysis/pgn/submit',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                }
            );
            
            if (analysisResponse.data && analysisResponse.data.success) {
                return res.json({ 
                    success: true, 
                    analysisUrl: analysisUrl,
                    cached: false
                });
            } else {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Failed to analyze game' 
                });
            }
        }
    } catch (error) {
        console.error('Error analyzing game:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
