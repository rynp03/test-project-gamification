import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Gift,
  Crown,
  Ticket,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Pencil,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parse } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  cancelCommissionTierStep,
  chooseRewardEventDraft,
  chooseRewardWithDraft,
  commitRewardEventDraft,
  commitOnboardedRewardEvent,
  commitRewardWithDraft,
  flushPendingRewardWithPopoverOpen,
  openCommissionRewardFlow,
  openCommissionTierStepForEdit,
  saveCommissionTierStep,
  selectBonusAmount,
  selectCommissionTierDraftId,
  selectCommissionTierId,
  selectCommissionTierStepActive,
  selectDialogOpen,
  selectDraftBonusAmount,
  selectDraftEvent,
  selectDraftPostsCount,
  selectDraftPostsDuration,
  selectDraftRewardWith,
  selectDraftSales,
  selectEndDate,
  selectEventPopoverFooterVisible,
  selectEventPopoverOpen,
  selectIsTimeBound,
  selectRewardEvent,
  selectRewardWith,
  selectRewardWithFooterVisible,
  selectPostsDuration,
  selectPostsTimesCount,
  selectPendingOpenRewardWithPopover,
  selectRewardWithPopoverOpen,
  selectSalesThreshold,
  setCommissionTierDraftId,
  setDialogOpen,
  setDraftBonusAmount,
  setDraftPostsCount,
  setDraftPostsDuration,
  setDraftSales,
  setEndDate,
  setEventPopoverOpen,
  setRewardWithPopoverOpen,
  setTimeBound,
} from "@/app/features/gamificationModalSlice";

/** Mock tiers — same label as design; ids distinguish rows */
const COMMISSION_TIERS = [
  { id: "tier-1", label: "Tier Name Here" },
  { id: "tier-2", label: "Tier Name Here" },
  { id: "tier-3", label: "Tier Name Here" },
  { id: "tier-4", label: "Tier Name Here" },
  { id: "tier-5", label: "Tier Name Here" },
];

function tierLabelById(id) {
  return COMMISSION_TIERS.find((t) => t.id === id)?.label ?? "";
}

const POSTS_DURATIONS = [
  { id: "14d", label: "14 days" },
  { id: "1mo", label: "1 month" },
  { id: "2mo", label: "2 months" },
  { id: "3mo", label: "3 months" },
  { id: "1y", label: "1 year" },
];

function postsDurationLabel(id) {
  return POSTS_DURATIONS.find((d) => d.id === id)?.label ?? "";
}

const saveHintTooltipClassName =
  "z-110 max-w-[280px] rounded-[10px] border-none bg-[#2d2d2d] px-4 py-2.5 text-[0.75rem] font-light leading-snug text-white shadow-xl";

const GamificationPage = () => {
  const dispatch = useDispatch();
  const dialogOpen = useSelector(selectDialogOpen);
  const rewardEvent = useSelector(selectRewardEvent);
  const salesThreshold = useSelector(selectSalesThreshold);
  const rewardWith = useSelector(selectRewardWith);
  const bonusAmount = useSelector(selectBonusAmount);
  const rewardWithPopoverOpen = useSelector(selectRewardWithPopoverOpen);
  const pendingOpenRewardWithPopover = useSelector(
    selectPendingOpenRewardWithPopover
  );
  const draftRewardWith = useSelector(selectDraftRewardWith);
  const draftBonusAmount = useSelector(selectDraftBonusAmount);
  const rewardWithFooterVisible = useSelector(selectRewardWithFooterVisible);
  const commissionTierStepActive = useSelector(selectCommissionTierStepActive);
  const commissionTierDraftId = useSelector(selectCommissionTierDraftId);
  const commissionTierId = useSelector(selectCommissionTierId);
  const postsTimesCount = useSelector(selectPostsTimesCount);
  const postsDuration = useSelector(selectPostsDuration);
  const draftPostsCount = useSelector(selectDraftPostsCount);
  const draftPostsDuration = useSelector(selectDraftPostsDuration);
  const [tierPickerOpen, setTierPickerOpen] = useState(false);
  const [postsDurationOpen, setPostsDurationOpen] = useState(false);
  const [endDatePopoverOpen, setEndDatePopoverOpen] = useState(false);
  const [rewardCreatedToast, setRewardCreatedToast] = useState(false);
  /** Ignore outside-dismiss + spurious onOpenChange(false) right after auto-open (event popover teardown) */
  const rewardWithDismissShieldUntilRef = useRef(0);
  const isTimeBound = useSelector(selectIsTimeBound);
  const endDate = useSelector(selectEndDate);
  const eventPopoverOpen = useSelector(selectEventPopoverOpen);
  const draftEvent = useSelector(selectDraftEvent);
  const draftSales = useSelector(selectDraftSales);
  const eventPopoverFooterVisible = useSelector(
    selectEventPopoverFooterVisible
  );

  useEffect(() => {
    if (draftEvent !== "posts") {
      setPostsDurationOpen(false);
      return;
    }
    const id = requestAnimationFrame(() => setPostsDurationOpen(true));
    return () => cancelAnimationFrame(id);
  }, [draftEvent]);

  useEffect(() => {
    if (!rewardCreatedToast) return;
    const t = window.setTimeout(() => setRewardCreatedToast(false), 3500);
    return () => window.clearTimeout(t);
  }, [rewardCreatedToast]);

  useEffect(() => {
    if (!isTimeBound) setEndDatePopoverOpen(false);
  }, [isTimeBound]);

  useEffect(() => {
    if (!pendingOpenRewardWithPopover) return;
    let cancelled = false;
    const t = window.setTimeout(() => {
      if (cancelled) return;
      rewardWithDismissShieldUntilRef.current = Date.now() + 900;
      dispatch(flushPendingRewardWithPopoverOpen());
    }, 150);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [pendingOpenRewardWithPopover, dispatch]);

  const rewardWithShieldActive = () =>
    Date.now() < rewardWithDismissShieldUntilRef.current;

  const handleRewardWithOpenChange = (open) => {
    if (!open && rewardWithShieldActive()) return;
    dispatch(setRewardWithPopoverOpen(open));
  };

  const date = endDate
    ? parse(endDate, "yyyy-MM-dd", new Date())
    : undefined;

  const salesAmountValid =
    draftSales.trim().length > 0 &&
    !Number.isNaN(Number(draftSales.replace(/,/g, "")));

  const postsCountValid =
    draftPostsCount.trim().length > 0 &&
    !Number.isNaN(Number(draftPostsCount.replace(/,/g, "")));
  const postsFormValid = postsCountValid && !!draftPostsDuration;

  const canSaveRewardEvent =
    (draftEvent === "sales" && salesAmountValid) ||
    (draftEvent === "posts" && postsFormValid);

  const commitRewardEvent = () => {
    if (!canSaveRewardEvent) return;
    dispatch(commitRewardEventDraft());
  };

  const cancelRewardEvent = () => {
    dispatch(setEventPopoverOpen(false));
  };

  const bonusAmountValid =
    draftBonusAmount.trim().length > 0 &&
    !Number.isNaN(Number(draftBonusAmount.replace(/,/g, "")));

  const canSaveRewardWith =
    draftRewardWith === "bonus" && bonusAmountValid;

  const commitRewardWith = () => {
    if (!canSaveRewardWith) return;
    dispatch(commitRewardWithDraft());
  };

  const cancelRewardWith = () => {
    dispatch(setRewardWithPopoverOpen(false));
  };

  const rewardEventComplete =
    !!rewardEvent &&
    (rewardEvent === "onboarded" ||
      (rewardEvent === "sales" &&
        !!(salesThreshold && salesThreshold.trim().length > 0)) ||
      (rewardEvent === "posts" &&
        !!(postsTimesCount && postsTimesCount.trim().length > 0) &&
        !!postsDuration));

  const commissionTierPickEnabled = rewardEvent === "sales";

  const rewardWithComplete =
    (rewardWith === "bonus" &&
      !!(bonusAmount && bonusAmount.trim().length > 0)) ||
    (rewardWith === "commission" &&
      commissionTierPickEnabled &&
      !!(commissionTierId && commissionTierId.length > 0));

  // Updated grid pattern to better match the screenshot
  // 0: white, 1: #fef1fe (bg-gamification-grid-1), 2: #fefbfe (bg-gamification-grid-2)
  const gridPattern = [
    [0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0],
    [2, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 1, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const cards = [
    {
      icon: Gift,
      title: "Reward Your Ambassadors",
      description:
        "Boost campaign performance by setting up rewards for ambassadors",
    },
    {
      icon: Crown,
      title: "Set Milestones",
      description:
        "Set up custom goals for sales, posts, or time-based achievements",
    },
    {
      icon: Ticket,
      title: "Customise Incentives",
      description:
        "Create custom incentives like flat fees, free products, or special commissions.",
    },
  ];

  return (
    <div className="relative flex flex-col items-center">
      {/* Main Banner with Grid */}
      <div className="relative w-full h-[320px] border border-gamification-grid-border rounded-[15px] overflow-hidden bg-white mb-[-60px] z-0">
        {/* Background Grid */}
        <div
          className="absolute inset-0 grid grid-cols-13"
          style={{ gridTemplateRows: "repeat(4, 1fr) 0.33fr" }}
        >
          {gridPattern.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  "border-[0.5px] border-sidebar-custom-active/10",
                  cell === 1 && "bg-gamification-grid-1",
                  cell === 2 && "bg-gamification-grid-2",
                  cell === 0 && "bg-white",
                )}
              />
            )),
          )}
        </div>

        {/* Local White Fade Overlay behind text */}
        <div className="absolute inset-0 z-5 flex items-center justify-center">
          <div className="w-[500px] h-[240px] bg-white/80 blur-3xl rounded-full" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10 pb-16">
          <h2 className="text-[1.75rem] font-normal text-gamification-heading mb-1 tracking-tight">
            Gamify your Campaign
          </h2>
          <p className="text-sidebar-custom-text text-[1rem] max-w-[280px] mb-6 leading-relaxed font-light opacity-90">
            Enable gamification to start crafting your custom reward system.
          </p>

          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => dispatch(setDialogOpen(open))}
          >
            <DialogTrigger asChild>
              <Button className="bg-sidebar-custom-active hover:bg-sidebar-custom-active/90 text-white px-20 py-5 rounded-[10px] text-[1rem] font-normal transition-all active:scale-95">
                Enable Gamification
              </Button>
            </DialogTrigger>
            <DialogContent
              showCloseButton={false}
              className="sm:max-w-[400px] rounded-[15px] p-0 overflow-hidden border-none shadow-2xl bg-white/95 backdrop-blur-md"
            >
              <div className="p-6">
                {commissionTierStepActive ? (
                  <>
                    <DialogHeader className="mb-6 flex flex-row items-center justify-between space-y-0">
                      <DialogTitle className="text-[1.25rem] font-normal text-gray-800">
                        Select a commission tier
                      </DialogTitle>
                      <button
                        type="button"
                        onClick={() => dispatch(cancelCommissionTierStep())}
                        className="rounded-md p-1 transition-colors hover:bg-gray-100"
                      >
                        <X className="h-5 w-5 text-gray-500" />
                      </button>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className="inline-flex items-baseline gap-0 text-[0.85rem] font-normal text-gray-600">
                          Upgrade to
                          <sup className="ml-px translate-y-[-0.08em] text-[0.6em] font-normal leading-none text-red-500">
                            *
                          </sup>
                        </Label>
                        <Popover
                          open={tierPickerOpen}
                          onOpenChange={setTierPickerOpen}
                        >
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className={cn(
                                "flex h-10 w-full items-center justify-between gap-2 rounded-[10px] border-2 bg-transparent px-4 text-left text-sm font-light transition-all outline-none select-none",
                                "border-gray-200 focus-visible:border-sidebar-custom-active focus-visible:ring-0",
                                tierPickerOpen && "border-sidebar-custom-active",
                                commissionTierDraftId
                                  ? "text-black"
                                  : "text-gray-400"
                              )}
                            >
                              <span className="truncate">
                                {commissionTierDraftId
                                  ? tierLabelById(commissionTierDraftId)
                                  : "Select a tier"}
                              </span>
                              {tierPickerOpen ? (
                                <ChevronUp className="size-4 shrink-0 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                              )}
                            </button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="z-70 w-(--radix-popper-anchor-width) max-w-(--radix-popper-available-width) rounded-[10px] border border-gray-200 p-1 shadow-lg"
                            align="start"
                            side="bottom"
                            sideOffset={4}
                          >
                            <div className="flex flex-col py-0.5">
                              {COMMISSION_TIERS.map((tier) => (
                                <button
                                  key={tier.id}
                                  type="button"
                                  onClick={() => {
                                    dispatch(setCommissionTierDraftId(tier.id));
                                    setTierPickerOpen(false);
                                  }}
                                  className={cn(
                                    "w-full rounded-[8px] px-3 py-2.5 text-left text-sm font-light transition-colors",
                                    commissionTierDraftId === tier.id
                                      ? "bg-[#fce8fc] text-sidebar-custom-active"
                                      : "text-gray-900 hover:bg-gray-50"
                                  )}
                                >
                                  {tier.label}
                                </button>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="flex gap-4 pt-1">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => dispatch(cancelCommissionTierStep())}
                          className="h-10 flex-1 rounded-[10px] border-gray-200 font-normal text-gray-700 hover:bg-gray-50"
                        >
                          Go Back
                        </Button>
                        <Button
                          type="button"
                          disabled={!commissionTierDraftId}
                          onClick={() => dispatch(saveCommissionTierStep())}
                          className="h-10 flex-1 rounded-[10px] bg-sidebar-custom-active font-normal text-white shadow-none hover:bg-sidebar-custom-active/90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <DialogHeader className="mb-6 flex flex-row items-center justify-between space-y-0">
                      <DialogTitle className="text-[1.25rem] font-normal text-gray-800">
                        Create your reward system
                      </DialogTitle>
                      <DialogClose asChild>
                        <button className="rounded-md p-1 transition-colors hover:bg-gray-100">
                          <X className="h-5 w-5 text-gray-500" />
                        </button>
                      </DialogClose>
                    </DialogHeader>

                    <div className="space-y-4">
                  {/* Reward Event */}
                  <div className="space-y-1.5">
                    <Label className="inline-flex items-baseline gap-0 text-[0.85rem] font-normal text-gray-600">
                      Reward event
                      <sup className="ml-px translate-y-[-0.08em] text-[0.6em] font-normal leading-none text-red-500">
                        *
                      </sup>
                    </Label>
                    <Popover
                      open={eventPopoverOpen}
                      onOpenChange={(open) => dispatch(setEventPopoverOpen(open))}
                    >
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className={cn(
                            "flex h-10 w-full items-center justify-between gap-2 rounded-[10px] border-2 bg-transparent px-4 text-left text-sm font-light transition-all outline-none select-none",
                            "border-gray-200 focus-visible:border-sidebar-custom-active focus-visible:ring-0",
                            eventPopoverOpen && "border-sidebar-custom-active",
                            rewardEventComplete ? "text-black" : "text-gray-400"
                          )}
                        >
                          <span className="truncate">
                            {!rewardEvent && "Select an event"}
                            {rewardEvent === "sales" &&
                              `Cross $${salesThreshold || "X"} in sales`}
                            {rewardEvent === "posts" &&
                              (postsTimesCount && postsDuration
                                ? `Posts ${postsTimesCount} times every ${postsDurationLabel(postsDuration)}`
                                : "Posts X times every Y period")}
                            {rewardEvent === "onboarded" && "Is Onboarded"}
                          </span>
                          {eventPopoverOpen ? (
                            <ChevronUp className="size-4 shrink-0 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                          )}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-(--radix-popper-anchor-width) max-w-(--radix-popper-available-width) rounded-[10px] border border-gray-200 p-0 shadow-lg z-70"
                        align="start"
                        side="bottom"
                        sideOffset={4}
                      >
                        <div className="flex flex-col">
                          <button
                            type="button"
                            onClick={() =>
                              dispatch(chooseRewardEventDraft("sales"))
                            }
                            className={cn(
                              "flex h-10 w-full items-center justify-between gap-2 px-3 text-left text-sm font-light transition-colors rounded-t-[10px]",
                              draftEvent === "sales"
                                ? "bg-[#fce8fc] text-sidebar-custom-active"
                                : "text-gray-900 hover:bg-gray-50"
                            )}
                          >
                            <span>Cross $X in sales</span>
                            {draftEvent === "sales" && (
                              <Check
                                className="size-4 shrink-0 text-sidebar-custom-active"
                                strokeWidth={2.5}
                              />
                            )}
                          </button>

                          {draftEvent === "sales" && (
                            <div className="border-t border-gray-100 px-3 py-2">
                              <div
                                className={cn(
                                  "flex h-10 w-full items-center gap-1 rounded-[10px] border-2 border-sidebar-custom-active bg-white px-3"
                                )}
                              >
                                <span className="text-gray-500 font-light select-none">
                                  $
                                </span>
                                <input
                                  type="text"
                                  inputMode="decimal"
                                  autoComplete="off"
                                  placeholder=""
                                  value={draftSales}
                                  onChange={(e) => {
                                    const v = e.target.value.replace(
                                      /[^\d.]/g,
                                      ""
                                    );
                                    const parts = v.split(".");
                                    const next =
                                      parts.length > 2
                                        ? `${parts[0]}.${parts.slice(1).join("")}`
                                        : v;
                                    dispatch(setDraftSales(next));
                                  }}
                                  className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm font-light text-black outline-none placeholder:text-gray-400"
                                />
                              </div>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              dispatch(chooseRewardEventDraft("posts"))
                            }
                            className={cn(
                              "flex h-10 w-full items-center justify-between gap-2 px-3 text-left text-sm font-light transition-colors",
                              draftEvent === "posts"
                                ? "bg-[#fce8fc] text-sidebar-custom-active"
                                : "text-gray-900 hover:bg-gray-50"
                            )}
                          >
                            <span>Posts X times every Y period</span>
                            {draftEvent === "posts" && (
                              <Check
                                className="size-4 shrink-0 text-sidebar-custom-active"
                                strokeWidth={2.5}
                              />
                            )}
                          </button>

                          {draftEvent === "posts" && (
                            <div className="space-y-2 border-t border-gray-100 px-3 py-2">
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  autoComplete="off"
                                  placeholder="eg: 4"
                                  value={draftPostsCount}
                                  onChange={(e) => {
                                    const v = e.target.value.replace(
                                      /\D/g,
                                      ""
                                    );
                                    dispatch(setDraftPostsCount(v));
                                  }}
                                  className="h-10 min-w-0 flex-1 basis-0 rounded-[10px] border-2 border-gray-200 bg-white px-3 text-left text-sm font-light text-black placeholder:text-gray-400 outline-none focus:border-sidebar-custom-active"
                                />
                                <div className="min-w-0 flex-1 basis-0">
                                  <Popover
                                    open={postsDurationOpen}
                                    onOpenChange={setPostsDurationOpen}
                                  >
                                    <PopoverTrigger asChild>
                                      <button
                                        type="button"
                                        className={cn(
                                          "flex h-10 w-full min-w-0 items-center justify-between gap-2 rounded-[10px] border-2 bg-transparent px-3 text-left text-sm font-light transition-all outline-none select-none",
                                          "border-gray-200 focus-visible:border-sidebar-custom-active focus-visible:ring-0",
                                          postsDurationOpen &&
                                            "border-sidebar-custom-active",
                                          draftPostsDuration
                                            ? "text-black"
                                            : "text-gray-400"
                                        )}
                                      >
                                        <span className="truncate">
                                          {draftPostsDuration
                                            ? postsDurationLabel(
                                                draftPostsDuration
                                              )
                                            : "Select duration"}
                                        </span>
                                        {postsDurationOpen ? (
                                          <ChevronUp className="size-4 shrink-0 text-muted-foreground" />
                                        ) : (
                                          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                                        )}
                                      </button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="z-70 w-(--radix-popper-anchor-width) max-w-(--radix-popper-available-width) rounded-[10px] border border-gray-200 p-1 shadow-lg"
                                      align="start"
                                      side="bottom"
                                      sideOffset={4}
                                    >
                                      <div className="flex flex-col py-0.5">
                                        {POSTS_DURATIONS.map((d) => (
                                          <button
                                            key={d.id}
                                            type="button"
                                            onClick={() => {
                                              dispatch(
                                                setDraftPostsDuration(d.id)
                                              );
                                              setPostsDurationOpen(false);
                                            }}
                                            className={cn(
                                              "w-full rounded-[8px] px-3 py-2.5 text-left text-sm font-light transition-colors",
                                              draftPostsDuration === d.id
                                                ? "bg-[#fce8fc] text-sidebar-custom-active"
                                                : "text-gray-900 hover:bg-gray-50"
                                            )}
                                          >
                                            {d.label}
                                          </button>
                                        ))}
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </div>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              dispatch(commitOnboardedRewardEvent())
                            }
                            className={cn(
                              "flex h-10 w-full items-center justify-between gap-2 px-3 text-left text-sm font-light transition-colors",
                              !eventPopoverFooterVisible && "rounded-b-[10px]",
                              rewardEvent === "onboarded"
                                ? "bg-[#fce8fc] text-sidebar-custom-active"
                                : "text-gray-900 hover:bg-gray-50"
                            )}
                          >
                            <span>Is Onboarded</span>
                            {rewardEvent === "onboarded" && (
                              <Check
                                className="size-4 shrink-0 text-sidebar-custom-active"
                                strokeWidth={2.5}
                              />
                            )}
                          </button>

                          {eventPopoverFooterVisible && (
                            <div className="flex gap-2 border-t border-gray-100 p-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={cancelRewardEvent}
                                className="h-9 flex-1 rounded-[10px] border-gray-200 text-gray-700 font-normal hover:bg-gray-50"
                              >
                                Cancel
                              </Button>
                              <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex-1">
                                      <Button
                                        type="button"
                                        disabled={!canSaveRewardEvent}
                                        onClick={commitRewardEvent}
                                        className="h-9 w-full rounded-[10px] bg-sidebar-custom-active font-normal text-white shadow-none hover:bg-sidebar-custom-active/90 disabled:cursor-not-allowed disabled:opacity-50"
                                      >
                                        Save
                                      </Button>
                                    </div>
                                  </TooltipTrigger>
                                  {!canSaveRewardEvent &&
                                    draftEvent === "sales" && (
                                      <TooltipContent
                                        side="bottom"
                                        sideOffset={6}
                                        className={saveHintTooltipClassName}
                                      >
                                        <p>
                                          Enter the sales target amount to
                                          continue
                                        </p>
                                      </TooltipContent>
                                    )}
                                  {!canSaveRewardEvent &&
                                    draftEvent === "posts" && (
                                      <TooltipContent
                                        side="bottom"
                                        sideOffset={6}
                                        className={saveHintTooltipClassName}
                                      >
                                        <p>
                                          Enter post count and select a
                                          duration to continue
                                        </p>
                                      </TooltipContent>
                                    )}
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Reward With */}
                  <div className="space-y-1.5">
                    <Label className="inline-flex items-baseline gap-0 text-[0.85rem] font-normal text-gray-600">
                      Reward with
                      <sup className="ml-px translate-y-[-0.08em] text-[0.6em] font-normal leading-none text-red-500">
                        *
                      </sup>
                    </Label>
                    <Popover
                      open={rewardWithPopoverOpen}
                      onOpenChange={handleRewardWithOpenChange}
                    >
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className={cn(
                            "flex h-10 w-full items-center justify-between gap-2 rounded-[10px] border-2 bg-transparent px-4 text-left text-sm font-light transition-all outline-none select-none",
                            "border-gray-200 focus-visible:border-sidebar-custom-active focus-visible:ring-0",
                            rewardWithPopoverOpen &&
                              "border-sidebar-custom-active",
                            rewardWithComplete ? "text-black" : "text-gray-400"
                          )}
                        >
                          <span className="truncate">
                            {!rewardWith && "Select a reward"}
                            {rewardWith === "bonus" &&
                              `Flat $${bonusAmount || "X"} bonus`}
                            {rewardWith === "commission" &&
                              (commissionTierId
                                ? `Upgrade to ${tierLabelById(commissionTierId)}`
                                : "Upgrade commission tier")}
                          </span>
                          {rewardWithPopoverOpen ? (
                            <ChevronUp className="size-4 shrink-0 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                          )}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-(--radix-popper-anchor-width) max-w-(--radix-popper-available-width) rounded-[10px] border border-gray-200 p-0 shadow-lg z-70"
                        align="start"
                        side="bottom"
                        sideOffset={4}
                        onOpenAutoFocus={(e) => e.preventDefault()}
                        onInteractOutside={(e) => {
                          if (rewardWithShieldActive()) e.preventDefault();
                        }}
                        onPointerDownOutside={(e) => {
                          if (rewardWithShieldActive()) e.preventDefault();
                        }}
                        onFocusOutside={(e) => {
                          if (rewardWithShieldActive()) e.preventDefault();
                        }}
                      >
                        <div className="flex flex-col">
                          <button
                            type="button"
                            onClick={() =>
                              dispatch(chooseRewardWithDraft("bonus"))
                            }
                            className={cn(
                              "flex h-10 w-full items-center justify-between gap-2 px-3 text-left text-sm font-light transition-colors rounded-t-[10px]",
                              draftRewardWith === "bonus"
                                ? "bg-[#fce8fc] text-sidebar-custom-active"
                                : "text-gray-900 hover:bg-gray-50"
                            )}
                          >
                            <span>Flat $X bonus</span>
                            {draftRewardWith === "bonus" && (
                              <Check
                                className="size-4 shrink-0 text-sidebar-custom-active"
                                strokeWidth={2.5}
                              />
                            )}
                          </button>

                          {draftRewardWith === "bonus" && (
                            <div className="border-t border-gray-100 px-3 py-2">
                              <div
                                className={cn(
                                  "flex h-10 w-full items-center gap-1 rounded-[10px] border-2 border-sidebar-custom-active bg-white px-3"
                                )}
                              >
                                <span className="text-gray-500 font-light select-none">
                                  $
                                </span>
                                <input
                                  type="text"
                                  inputMode="decimal"
                                  autoComplete="off"
                                  value={draftBonusAmount}
                                  onChange={(e) => {
                                    const v = e.target.value.replace(
                                      /[^\d.]/g,
                                      ""
                                    );
                                    const parts = v.split(".");
                                    const next =
                                      parts.length > 2
                                        ? `${parts[0]}.${parts.slice(1).join("")}`
                                        : v;
                                    dispatch(setDraftBonusAmount(next));
                                  }}
                                  className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm font-light text-black outline-none placeholder:text-gray-400"
                                />
                              </div>
                            </div>
                          )}

                          {commissionTierPickEnabled ? (
                            <div
                              className={cn(
                                "flex h-10 w-full items-center gap-1 px-3 transition-colors",
                                rewardWith === "commission"
                                  ? "bg-[#fce8fc] text-sidebar-custom-active"
                                  : "text-gray-900 hover:bg-gray-50",
                                !rewardWithFooterVisible &&
                                  "rounded-b-[10px]"
                              )}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  if (
                                    rewardWith === "commission" &&
                                    commissionTierId
                                  ) {
                                    dispatch(
                                      openCommissionTierStepForEdit()
                                    );
                                  } else {
                                    dispatch(openCommissionRewardFlow());
                                  }
                                }}
                                className="flex h-full min-h-0 min-w-0 flex-1 items-center justify-between gap-2 py-0 text-left text-sm font-light leading-none"
                              >
                                <span className="truncate leading-normal">
                                  {rewardWith === "commission" &&
                                  commissionTierId
                                    ? `Upgrade to ${tierLabelById(commissionTierId)}`
                                    : "Upgrade commission tier"}
                                </span>
                                {rewardWith === "commission" &&
                                  !commissionTierId && (
                                    <Check
                                      className="size-4 shrink-0 text-sidebar-custom-active"
                                      strokeWidth={2.5}
                                    />
                                  )}
                              </button>
                              {rewardWith === "commission" &&
                                commissionTierId && (
                                  <button
                                    type="button"
                                    aria-label="Edit commission tier"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      dispatch(
                                        openCommissionTierStepForEdit()
                                      );
                                    }}
                                    className="flex size-7 shrink-0 items-center justify-center rounded-md text-sidebar-custom-active transition-colors hover:bg-white/80"
                                  >
                                    <Pencil
                                      className="size-3.5"
                                      strokeWidth={2}
                                    />
                                  </button>
                                )}
                            </div>
                          ) : (
                            <div
                              className={cn(
                                "flex h-10 w-full items-center px-3 text-sm font-light text-gray-400 cursor-not-allowed select-none",
                                !rewardWithFooterVisible &&
                                  "rounded-b-[10px]"
                              )}
                              aria-disabled="true"
                            >
                              <span className="truncate">
                                Upgrade commission tier
                              </span>
                            </div>
                          )}

                          {rewardWithFooterVisible && (
                            <div className="flex gap-2 border-t border-gray-100 p-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={cancelRewardWith}
                                className="h-9 flex-1 rounded-[10px] border-gray-200 text-gray-700 font-normal hover:bg-gray-50"
                              >
                                Cancel
                              </Button>
                              <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex-1">
                                      <Button
                                        type="button"
                                        disabled={!canSaveRewardWith}
                                        onClick={commitRewardWith}
                                        className="h-9 w-full rounded-[10px] bg-sidebar-custom-active font-normal text-white shadow-none hover:bg-sidebar-custom-active/90 disabled:cursor-not-allowed disabled:opacity-50"
                                      >
                                        Save
                                      </Button>
                                    </div>
                                  </TooltipTrigger>
                                  {!canSaveRewardWith &&
                                    draftRewardWith === "bonus" && (
                                      <TooltipContent
                                        side="bottom"
                                        sideOffset={6}
                                        className={saveHintTooltipClassName}
                                      >
                                        <p>
                                          Enter the bonus amount to continue
                                        </p>
                                      </TooltipContent>
                                    )}
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Time Bound Switch */}
                  <div className="space-y-3 py-0.5">
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-[0.95rem] font-normal text-gray-800">
                          Make the reward time bound
                        </Label>
                        <p className="text-[0.8rem] text-gray-500 font-light">
                          Choose an end date to stop this reward automatically.
                        </p>
                      </div>
                      <Switch
                        checked={isTimeBound}
                        onCheckedChange={(v) => dispatch(setTimeBound(v))}
                        className="mt-0.5 border-transparent data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-sidebar-custom-active data-[state=checked]:hover:bg-sidebar-custom-active/90 focus-visible:border-sidebar-custom-active focus-visible:ring-2 focus-visible:ring-sidebar-custom-active"
                      />
                    </div>

                    {isTimeBound && (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-200 space-y-1.5">
                        <Label className="inline-flex items-baseline gap-0 text-[0.85rem] font-normal text-gray-600">
                          End date
                          <sup className="ml-px translate-y-[-0.08em] text-[0.6em] font-normal leading-none text-red-500">
                            *
                          </sup>
                        </Label>
                        <Popover
                          open={endDatePopoverOpen}
                          onOpenChange={setEndDatePopoverOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full h-10 px-4 justify-start text-left font-light rounded-[10px] border-gray-200 hover:bg-transparent focus:ring-0 focus:border-sidebar-custom-active border-2 transition-all",
                                !endDate && "text-gray-400",
                                endDate && "text-black border-gray-200"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                              {date ? (
                                format(date, "d MMM, yyyy")
                              ) : (
                                <span>Select End Date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto p-0 rounded-[15px] border-none shadow-2xl overflow-hidden z-60"
                            align="start"
                            side="bottom"
                            sideOffset={8}
                          >
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={(d) => {
                                dispatch(
                                  setEndDate(
                                    d ? format(d, "yyyy-MM-dd") : null
                                  )
                                );
                                if (d) setEndDatePopoverOpen(false);
                              }}
                              disabled={(date) => {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                return date <= today;
                              }}
                              initialFocus
                              className="p-3"
                              classNames={{
                                day_selected:
                                  "rounded-[8px] bg-sidebar-custom-active text-white hover:bg-sidebar-custom-active hover:text-white focus:bg-sidebar-custom-active focus:text-white",
                                day_today: "bg-gray-100 text-gray-900 rounded-[8px]",
                                day: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-transparent [&:has([aria-selected])]:bg-transparent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                day_button: cn(
                                  "h-9 w-9 p-0 font-normal rounded-[8px] transition-colors [&>span]:opacity-100",
                                  "hover:bg-[#f5eaf5] hover:text-sidebar-custom-active",
                                  "data-[selected-single=true]:!bg-sidebar-custom-active data-[selected-single=true]:text-white",
                                  "data-[selected-single=true]:hover:!bg-sidebar-custom-active data-[selected-single=true]:hover:text-white",
                                  "data-[selected-single=true]:focus:!bg-sidebar-custom-active data-[selected-single=true]:focus:text-white",
                                  "data-[selected-single=true]:[&>span]:text-white data-[selected-single=true]:[&>span]:opacity-100"
                                ),
                                day_disabled: "text-gray-300 opacity-50 cursor-not-allowed",
                                head_cell: "text-gray-400 rounded-md w-9 font-normal text-[0.8rem]",
                                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-gray-100 rounded-md transition-all",
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                  </div>

                  {/* Footer Buttons */}
                  <div className="flex gap-4 pt-1">
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        className="flex-1 h-10 rounded-[10px] border-gray-200 text-gray-700 font-normal hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex-1">
                            <Button
                              disabled={
                                !rewardEventComplete ||
                                !rewardWithComplete ||
                                (isTimeBound && !endDate)
                              }
                              onClick={() => {
                                dispatch(setDialogOpen(false));
                                setRewardCreatedToast(true);
                              }}
                              className="w-full h-10 rounded-[10px] bg-sidebar-custom-active font-normal text-white shadow-none transition-all hover:bg-sidebar-custom-active/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Create Reward
                            </Button>
                          </div>
                        </TooltipTrigger>
                        {(!rewardEventComplete ||
                          !rewardWithComplete ||
                          (isTimeBound && !endDate)) && (
                          <TooltipContent
                            side="bottom"
                            className="z-110 rounded-[10px] border-none bg-[#2d2d2d] px-4 py-2 text-[0.75rem] font-light text-white shadow-xl"
                          >
                            <p>
                              {isTimeBound && !endDate
                                ? "Please select an end date"
                                : !rewardEvent || !rewardWith
                                  ? "Choose a reward trigger and a reward to continue"
                                  : rewardEvent === "posts" &&
                                      (!postsTimesCount || !postsDuration)
                                    ? "Complete posts frequency and duration"
                                    : rewardEvent === "sales" &&
                                        rewardWith === "commission" &&
                                        !commissionTierId
                                      ? "Select and save a commission tier"
                                      : "Choose a reward trigger and a reward to continue"}
                            </p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Reward Cards (Floating) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl px-4 z-20">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="relative bg-white border border-sidebar-custom-active/10 rounded-[10px] p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-2 transition-all duration-300 group cursor-pointer overflow-hidden"
          >
            {/* Background Curved Lines */}
            <div className="absolute inset-0 z-0 opacity-[0.1] pointer-events-none">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 400 200"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-sidebar-custom-active"
              >
                {/* Cluster from top-right area */}
                <path
                  d="M450 10 Q 300 80, 150 10 T -50 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
                <path
                  d="M450 22 Q 300 92, 150 22 T -50 52"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
                <path
                  d="M450 34 Q 300 104, 150 34 T -50 64"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
                <path
                  d="M450 46 Q 300 116, 150 46 T -50 76"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
                <path
                  d="M450 58 Q 300 128, 150 58 T -50 88"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
                <path
                  d="M450 70 Q 300 140, 150 70 T -50 100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-14 h-14 rounded-[10px] bg-[#fbcffb] flex items-center justify-center mb-4">
                <div className="w-10 h-10 rounded-[8px] bg-white flex items-center justify-center shadow-sm">
                  <card.icon className="size-6 text-gamification-icon" />
                </div>
              </div>
              <h3 className="text-black text-[1rem] font-normal mb-2">
                {card.title}
              </h3>
              <p className="text-sidebar-custom-text text-[0.85rem] leading-relaxed font-light">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {rewardCreatedToast && (
        <div
          role="status"
          aria-live="polite"
          className="animate-in fade-in slide-in-from-bottom-4 fixed bottom-8 left-1/2 z-200 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#2d2d2d] px-3 py-1.5 shadow-md duration-300"
        >
          <span
            className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#7ed9be]"
            aria-hidden
          >
            <Check className="size-3 text-gray-900" strokeWidth={2.5} />
          </span>
          <span className="text-[0.8125rem] font-normal leading-none tracking-tight text-white">
            Reward Created!
          </span>
        </div>
      )}
    </div>
  );
};

export default GamificationPage;
