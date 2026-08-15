export const MailBodyUnsubscribe = (userData) => {
  return `
          <div style="text-align: center; background-color: white;"> 
              <div>
                  <H1>
                  Bonjour ${userData.name}, nous avons bien pris en compte votre demande de désabonnement.
                  </H1>
                  
                  <h2>Vous n'êtes désormais plus abonné à Premium.</h2>
                  <h2>Nous espérons vous revoir bientôt.</h2>

              </div>
              <div style="text-align: center;>
                  <h2> Si vous n'êtes pas à l'origine de cette demande, veuillez nous contacter.</h2>
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
