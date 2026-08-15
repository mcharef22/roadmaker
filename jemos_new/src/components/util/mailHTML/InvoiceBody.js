export const InvoiceBody = (userData) => {
  return `
      <div style="text-align: center; background-color: white;"> 
      <div>
          <H1>
          Bonjour ${userData.name} !
          </H1>
          
      </div>
      <div style="text-align: center;">
         <h2>Merci d'avoir passé commande sur notre plateforme</h2>
         <h4>Vous retrouvez votre facture dans la partie Mes factures de votre profil.</h4>
         
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
