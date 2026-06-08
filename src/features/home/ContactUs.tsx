import React, { useState } from "react";
import { Container } from "../../components/layout/Container";
import { FadeUp } from "../../components/animations/FadeUp";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Send, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
// import { messageService } from "../../services/admin/messageService";
import { auth } from "../../lib/firebase";
import { signInAnonymously } from "firebase/auth";

export function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      let currentUser = user;

      if (!currentUser && auth) {
        const userCredential = await signInAnonymously(auth);
        currentUser = userCredential.user as any;
      }

      if (currentUser) {
        const { messageService } = await import("../../services/admin/messageService");
        const superAdminId = await messageService.getSuperAdminUid();
        const conversationId = await messageService.getOrCreateConversation(
          currentUser.uid,
          superAdminId,
        );

        const fullMessage = `Contact Form Submission:\n\nName: ${name}\nEmail: ${email}\n\nMessage: ${message}`;

        await messageService.sendMessage(
          conversationId,
          currentUser.uid,
          superAdminId,
          fullMessage,
        );
      }

      setIsSuccess(true);
      setName("");
      setEmail("");
      setMessage("");

      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error sending contact message:", error);
      // fallback if anonymous auth fails (e.g., if it's disabled in Firebase)
      alert("There was an error sending your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-surface/50 z-10 relative" id="contact-us">
      <Container>
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <div className="flex flex-col gap-4 text-center mb-12">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                Get In Touch
              </h2>
              <h3 className="text-4xl md:text-5xl font-display font-medium tracking-tight text-white leading-[1.1]">
                CONTACT US
              </h3>
              <p className="text-lg text-text-muted mt-4 font-light">
                Have a question or need assistance? Send a message directly to
                our team.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="bg-background border border-white/5 rounded-2xl p-8 md:p-10">
              {isSuccess ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} className="text-primary" />
                  </div>
                  <h4 className="text-2xl font-medium text-white mb-4">
                    Message Sent!
                  </h4>
                  <p className="text-text-muted">
                    Thank you, {name || "for reaching out"}. Our team will get
                    back to you shortly via the client portal messenger.
                  </p>
                  <Button
                    className="mt-8"
                    onClick={() => setIsSuccess(false)}
                    variant="outline"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-sm font-medium text-text-muted"
                      >
                        Your Name
                      </label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="bg-surface border-white/10"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-text-muted"
                      >
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@company.com"
                        required
                        className="bg-surface border-white/10"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium text-text-muted"
                    >
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you?"
                      required
                      rows={5}
                      className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 transition-all font-light resize-none"
                      disabled={isSubmitting}
                    ></textarea>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                        Sending Message...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2 font-bold tracking-[0.1em] uppercase">
                        Send Message <Send size={18} />
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </FadeUp>
        </div>
      </Container>
    </section>
  );
}
