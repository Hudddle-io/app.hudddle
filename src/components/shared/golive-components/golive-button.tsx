"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { startCountdownAsync } from "@/store/slice/counterSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useRouter } from "next/navigation";

const GoliveButton = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  // Disable button if overlay is active
  const isOverlayVisible = useSelector((state: RootState) => state.counter.isVisible);

  const handleClick = () => {
    if (!isOverlayVisible) {
      dispatch(startCountdownAsync());
    }
  };

  return (
    <Button
      className="w-[135px] absolute -bottom-28 right-0 px-24 py-[8px] bg-[#211451]"
      onClick={handleClick}
      disabled={isOverlayVisible}
    >
      Go live !
    </Button>
  );
};

export default GoliveButton;
