import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle"); // ✅ Fixed state initialization

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#e0c3fc] to-[#8ec5fc] lg:px-10 xl:px-10 md:px-10 px-6 py-16 w-full h-full">
      <div className="heading flex flex-col items-center mb-10 md:mb-10">
        <h2 className="text-3xl text-center md:text-5xl xl:text-5xl font-bold text-indigo-500 mb-3">
          Contact <span className="text-indigo-500">Us</span>
        </h2>
        <p className="text-sm md:text-lg md:font-semibold font-medium text-white">
          Get in touch with us for any inquiries, support, or assistance
        </p>
      </div>

      <div>
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Contact Us</CardTitle>
            <CardDescription>
              We'd love to hear from you. Send us a message and we'll respond as
              soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full text-gray-700 font-medium bg-transparent border-2 border-gray-200 py-3 rounded-lg hover:text-white hover:bg-indigo-600 hover:border-none"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
            {submitStatus === "success" && (
              <p className="mt-4 text-indigo-500 text-center">
                Message sent successfully!
              </p>
            )}
            {submitStatus === "error" && (
              <p className="mt-4 text-red-600 text-center">
                An error occurred. Please try again.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Contact;
