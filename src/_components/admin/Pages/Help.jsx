import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import team from "../../../assets/team.jpg";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";

function Help() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-2 md:px-6">
      <div className="heading w-full text-center font-bold text-2xl md:text-4xl text-red-500">
        <h1>
          Help <span className="text-indigo-600">Desk</span>
        </h1>
      </div>
      <div className="content shadow-lg mt-10 px-2 md:px-5 py-10 w-full">
        <div className="faq px-2 md:px-6 py-2 ">
          <div className="heading">
            <h1 className="text-2xl font-semibold text-indigo-600">FAQ</h1>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-10">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I add a new user?</AccordionTrigger>
                <AccordionContent>
                  Users are automatically registered when they activate their
                  card. Admins cannot manually add users but can manage them
                  from the User Management section.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How do I upload new cards?</AccordionTrigger>
                <AccordionContent>
                  Go to Card Management, Add new card with cardid and password.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  How do I create a new offer?
                </AccordionTrigger>
                <AccordionContent>
                  Go to Offer Management, Create Offer, set the discount,
                  validity, and terms, then click Save & Publish.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>How do I add a new admin?</AccordionTrigger>
                <AccordionContent>
                  Under Admin Management, click Add Admin and enter
                  credentitals.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>
                  What should I do if I forget my admin password?
                </AccordionTrigger>
                <AccordionContent>
                  Click Forgot Password on the login page and follow the reset
                  process.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger>
                  How do I disable an expired or discontinued offer?
                </AccordionTrigger>
                <AccordionContent>
                  You can either set an expiry date or manually disable the
                  offer under Offer Management.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7">
                <AccordionTrigger>How to change the password?</AccordionTrigger>
                <AccordionContent>
                  Go to Account section, click on Change Password button and
                  follow the further process to change the password.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="image w-[100%] md:w-[60%]">
              <img
                src={team}
                className="w-full h-96 object-cover rounded-md"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help;
