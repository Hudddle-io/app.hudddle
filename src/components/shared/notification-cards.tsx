"use client";
import React, { useEffect, useState } from "react";
import { Card, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Copy, X } from "lucide-react";
import Image from "next/image";

interface DeleteModalProps {
  message?: React.ReactNode;
  btnMessage?: string;
  onClose: () => void;
  // onDelete: () => void
}
export const DeleteModal: React.FC<DeleteModalProps> = ({
  message,
  btnMessage,
  onClose,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    setIsActive(true);
  }, []);

  const handleClose = () => {
    setIsActive(false);
    setTimeout(onClose, 300);
  };

  return (
    <Card
      className={`bg-custom-whitesmoke text-black fixed p-6 z-50 rounded-xl shadow-lg bottom-2 right-2 transform transition-transform duration-300 ${
        isActive ? "slide-in-active" : "slide-out-active"
      }`}
    >
      {" "}
      <div className="flex justify-end h-fit">
        <X
          color="gray"
          size={26}
          className="cursor-pointer"
          onClick={handleClose}
        />
      </div>
      <div className="w-[300px] mx-auto flex flex-col justify-center items-center">
        <img src="/success2.png" alt="Invite Icon" />
        {/* <Image src="/success.png" alt='success' className='py-0' width={140} height={140} /> */}
        <CardDescription className="text-center text-black pb-5">
          {message || (
            <>
              You&#39;re about to cancel your invite <br /> You&#39;re sure
              about this?
            </>
          )}
        </CardDescription>
        <Button className="bg-red-400 w-full">
          {btnMessage || <>Yes Delete</>}
        </Button>
      </div>
    </Card>
  );
};

interface SuccessModalProps {
  message?: React.ReactNode;
  btnMessage?: string;
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  message,
  btnMessage,
  onClose,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    setIsActive(true);
  }, []);

  const handleClose = () => {
    setIsActive(false);
    setTimeout(onClose, 300);
  };

  return (
    <Card
      className={`bg-custom-whitesmoke text-black fixed p-6 z-50 rounded-xl shadow-lg bottom-2 right-2 transform transition-transform duration-300 ${
        isActive ? "slide-in-active" : "slide-out-active"
      }`}
    >
      <div className="flex justify-end h-fit">
        <X
          color="gray"
          size={26}
          className="cursor-pointer"
          onClick={handleClose}
        />
      </div>
      <div className="w-[300px] mx-auto flex flex-col justify-center items-center">
        <img src="/success2.png" alt="Invite Icon" />
        <CardDescription className="text-center text-black pb-5">
          {message || (
            <>
              Invite sent successfully <br /> you&#39;ll get notified once your{" "}
              <br /> friends accept your request
            </>
          )}
        </CardDescription>
        <Button className="bg-custom-purple w-full" onClick={handleClose}>
          {btnMessage || "Okay, thanks"}
        </Button>
      </div>
    </Card>
  );
};

interface CopyLinkModalProps {
  onClose: () => void;
  inviteUrl?: string;
}
const CopyLinkModal: React.FC<CopyLinkModalProps> = ({
  onClose,
  inviteUrl,
}) => {
  const [copied, setCopied] = useState<Boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);

  const handleCopy = () => {
    const url = inviteUrl || `${window.location.origin}/auth/sign-up`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };
  useEffect(() => {
    setIsActive(true);
  }, []);

  const handleClose = () => {
    setIsActive(false);
    setTimeout(onClose, 300);
  };
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 transition-opacity duration-300 ${
        isActive ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <Card
        className={`bg-custom-whitesmoke text-black p-4 rounded-xl shadow-lg w-[350px] max-w-[92vw] transform transition-transform duration-300 ${
          isActive ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end h-fit">
          <X
            color="gray"
            size={26}
            className="cursor-pointer"
            onClick={handleClose}
          />
        </div>

        <div className="w-full mx-auto flex flex-col justify-center items-center">
          <img src="/success2.png" alt="Invite Icon" />
          <CardDescription className="text-center text-black pb-5">
            Here’s an invite link to get your <br /> friend over to Hudddle.
            <span className="font-bold">
              {" "}
              You can <br /> get 10 points if they join in!
            </span>
          </CardDescription>
          <Button
            onClick={handleCopy}
            className="bg-custom-purple w-full transform transition-all text-white space-x-4 flex items-center justify-center group"
          >
            {copied ? (
              <>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <span>Copy Link</span>
                <Copy
                  size={20}
                  className="ml-2 hidden group-hover:inline-block"
                />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CopyLinkModal;

interface NotificationProps {
  type: "copyLink" | "success" | "delete";
  message?: string;
  btnMessage?: string;
  inviteUrl?: string;
}

export const useNotification = () => {
  const [visible, setVisible] = useState(false);
  const [notificationProps, setNotificationProps] =
    useState<NotificationProps | null>(null);

  const showNotification = (props: NotificationProps) => {
    setNotificationProps(props);
    setVisible(true);
  };

  const hideNotification = () => {
    setVisible(false);
  };

  const NotificationComponent = () => {
    if (!visible || !notificationProps) return null;

    const { type, message, btnMessage, inviteUrl } = notificationProps;

    return type === "copyLink" ? (
      <CopyLinkModal onClose={hideNotification} inviteUrl={inviteUrl} />
    ) : type === "success" ? (
      <SuccessModal
        onClose={hideNotification}
        message={message || ""}
        btnMessage={btnMessage || ""}
      />
    ) : (
      <DeleteModal
        onClose={hideNotification}
        message={message || ""}
        btnMessage={btnMessage || ""}
      />
    );
  };

  return { showNotification, NotificationComponent };
};
