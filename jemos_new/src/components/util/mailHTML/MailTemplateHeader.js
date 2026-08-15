export const MailTemplateHeader = (title) => {
  return `
  <header style="margin-bottom: 5% ;">
    <div style="background-color: #62bad9;">
        <div>
            <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <div style="margin-left: 20px;">
                    <img src="cid:logo" alt="logo" style="padding: 20px 0 30px 3%; width: 40px;"/>
                </div>
                <div style="margin-left: 20px; color: white; text-align: left; padding-top: 10px;">
                    <h1>${title}</h1>
                </div>
            </div>
        </div>
    </div>
</header>
`;
};
