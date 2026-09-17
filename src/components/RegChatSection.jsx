import RegChat from './RegChat.jsx';

export default function RegChatSection() {
  return <section id="far-aim" className="section surface-dark reg-chat-section">
    <div className="container reg-chat-section__grid">
      <div className="reg-chat-section__copy">
        <p className="label">Key feature · FAR/AIM</p>
        <h2 className="heading">Ask the regulations.</h2>
        <p className="body-lg">
          Skip the index. Ask a plain question about privileges, currency, airspace, or maintenance,
          and get the FAR/AIM section that answers it — cited, summarized, and ready to save to your
          flight notes. Press <kbd className="reg-chat__kbd">⌘K</kbd> from anywhere on the page to open it.
        </p>
      </div>
      <div className="reg-chat-section__panel">
        <RegChat />
      </div>
    </div>
  </section>;
}
