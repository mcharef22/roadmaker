export const NewMessBody = (userData, message, subject) => {
  return `
        <div style="text-align: center; background-color: white;">
            <div>
                <H1>
                Nouveau message de la part de ${userData.name} à propos de ${subject}
                </H1>
                <i><h2>Message :</h2><i>
            </div>
            <div style="border: 3px solid #22B3A4; margin: 0 10% 0 10%; border-radius: 10px; text-align: center;">
                <p>${message}</p>
            </div>
        </div>
    `;
};
