const returnClarifaiRequestOptions = (imageUrl) => {
    // Your PAT (Personal Access Token) can be found in the Account's Security section
    const PAT = process.env.CLARIFAI_PAT;
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = process.env.CLARIFAI_USER_ID;       
    const APP_ID = process.env.CLARIFAI_APP_ID;
    // Change these to whatever model and image URL you want to use
    // const MODEL_ID = 'face-detection';
    // const MODEL_VERSION_ID = 'aa7f35c01e0642fda5cf400f543e7c40';    
    const IMAGE_URL = imageUrl;
    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    return requestOptions;
}

const handleImage = (db) => (req,res) => {
    const {id, input} = req.body;

    if(!id || !input) {
        return res.status(400).json('Empty input');
    } else {
        fetch("https://api.clarifai.com/v2/models/face-detection/outputs", returnClarifaiRequestOptions(input))
        .then(response => response.json())
        .then(response => {
            if(response) {
                db('users').where('id', '=', id)
                .increment('entries', 1)
                .returning('entries')
                .then(entries => {
                    res.json({entries: entries[0].entries, result: response});
                })
                .catch(err => res.status(400).json('Unable to get entries'));
            } else {
                res.status(400).json('No response from the Clarifai API');
            }
        })
        .catch(err => res.status(400).json('Error in API call'));
    }
};

export default handleImage;