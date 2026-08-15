export const ConfRegistrationMailBody = (newUser, lienConfirmation) => {
  return `
  <div style="text-align: center; background-color: white;"> 
  <div>
      <H1>
      Bienvenue sur RoadMaker ${newUser.name} !
      </H1>
      
  </div>
  <div style="text-align: center;">
     <h2>Afin de valider votre compte, veuillez cliquer sur le lien ci-dessous</h2>
    <a href=${lienConfirmation}>Confirmer mon compte</a>
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
