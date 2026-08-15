export const MessSendConfirmationBody = (userData, message) => {
  return `
        <div style="text-align: center; background-color: white;"> 
            <div>
                <H1>
                Merci ${userData.name} pour votre message, nous vous répondrons dans les plus brefs délais.
                </H1>
                
                <i><h2>Votre message :</h2><i>
            </div>
            <div style="border: 3px solid #22B3A4; margin: 0 10% 0 10%; border-radius: 10px; text-align: center;">
                <p>${message}</p>
            </div>
        </div>
        <div className="container"  style="margin-top: 25px ;">
            <div style="text-align: center;">
                <div className="row" style="margin-top: 30px;">
                <a>
                    <h3>Cordialement,</h3>
                </a>
                </div>
                <div className="row" style="margin-top: 10px;">
                <a>
                    <h3>L'equipe Mindful House</h3>
                </a>
                </div>
            </div>
        </div>
    `;
};
