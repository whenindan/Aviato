import { useState } from "react";

export default function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <section id="waitlist" className="section surface-dark">
      <div className="container">
        <p className="label">Get early access</p>
        <h2 className="display-md">Join the VYSION waitlist</h2>

        {submitted ? (
          <p className="body-lg waitlist__confirm" role="status">
            You're cleared for takeoff. This preview simulates signup; your email hasn't been submitted.
          </p>
        ) : (
          <form className="waitlist__row" onSubmit={handleSubmit}>
            <div className="field">
              <label className="label" htmlFor="waitlist-email">
                Email address
              </label>
              <input
                id="waitlist-email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <button className="btn btn--primary" type="submit">
              Join the waitlist
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
