import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dialogOpen: false,
  rewardEvent: "",
  salesThreshold: "",
  rewardWith: "",
  bonusAmount: "",
  /** Selected commission tier id (after tier step save) */
  commissionTierId: "",
  /** Full-screen tier picker inside the same dialog */
  commissionTierStepActive: false,
  /** Tier id selected in the tier step (before Save) */
  commissionTierDraftId: "",
  isTimeBound: false,
  endDate: null,
  eventPopoverOpen: false,
  draftEvent: "",
  draftSales: "",
  eventPopoverFooterVisible: false,
  rewardWithPopoverOpen: false,
  draftRewardWith: "",
  draftBonusAmount: "",
  rewardWithFooterVisible: false,
};

export const gamificationModalSlice = createSlice({
  name: "gamificationModal",
  initialState,
  reducers: {
    setDialogOpen: (state, action) => {
      if (!action.payload) {
        return { ...initialState };
      }
      state.dialogOpen = true;
    },
    setTimeBound: (state, action) => {
      state.isTimeBound = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    },
    setEventPopoverOpen: (state, action) => {
      const open = action.payload;
      state.eventPopoverOpen = open;
      state.eventPopoverFooterVisible = false;
      state.draftEvent = "";
      state.draftSales = "";
    },
    chooseRewardEventDraft: (state, action) => {
      state.draftEvent = action.payload;
      state.eventPopoverFooterVisible = true;
      if (action.payload !== "sales") {
        state.draftSales = "";
      }
    },
    setDraftSales: (state, action) => {
      state.draftSales = action.payload;
    },
    commitRewardEventDraft: (state) => {
      state.rewardEvent = state.draftEvent;
      state.salesThreshold =
        state.draftEvent === "sales" ? state.draftSales.trim() : "";
      state.eventPopoverOpen = false;
      state.eventPopoverFooterVisible = false;
      state.draftEvent = "";
      state.draftSales = "";
    },
    setRewardWithPopoverOpen: (state, action) => {
      const open = action.payload;
      state.rewardWithPopoverOpen = open;
      state.rewardWithFooterVisible = false;
      state.draftRewardWith = "";
      state.draftBonusAmount = "";
    },
    chooseRewardWithDraft: (state, action) => {
      state.draftRewardWith = action.payload;
      state.rewardWithFooterVisible = true;
      if (action.payload !== "bonus") {
        state.draftBonusAmount = "";
      }
    },
    setDraftBonusAmount: (state, action) => {
      state.draftBonusAmount = action.payload;
    },
    commitRewardWithDraft: (state) => {
      const next = state.draftRewardWith;
      state.rewardWith = next;
      state.bonusAmount =
        next === "bonus" ? state.draftBonusAmount.trim() : "";
      if (next === "bonus") {
        state.commissionTierId = "";
      }
      state.rewardWithPopoverOpen = false;
      state.rewardWithFooterVisible = false;
      state.draftRewardWith = "";
      state.draftBonusAmount = "";
      if (next === "commission") {
        state.commissionTierStepActive = true;
        state.commissionTierDraftId = state.commissionTierId;
      } else {
        state.commissionTierStepActive = false;
        state.commissionTierDraftId = "";
      }
    },
    /** Pick commission from reward popover: skip Cancel/Save, open tier step */
    openCommissionRewardFlow: (state) => {
      if (state.rewardWith !== "commission") {
        state.commissionTierId = "";
      }
      state.rewardWith = "commission";
      state.bonusAmount = "";
      state.rewardWithPopoverOpen = false;
      state.rewardWithFooterVisible = false;
      state.draftRewardWith = "";
      state.draftBonusAmount = "";
      state.commissionTierStepActive = true;
      state.commissionTierDraftId = state.commissionTierId;
    },
    setCommissionTierDraftId: (state, action) => {
      state.commissionTierDraftId = action.payload;
    },
    saveCommissionTierStep: (state) => {
      if (!state.commissionTierDraftId) return;
      state.commissionTierId = state.commissionTierDraftId;
      state.commissionTierStepActive = false;
      state.commissionTierDraftId = "";
    },
    cancelCommissionTierStep: (state) => {
      state.commissionTierStepActive = false;
      state.commissionTierDraftId = "";
    },
    openCommissionTierStepForEdit: (state) => {
      state.commissionTierStepActive = true;
      state.commissionTierDraftId = state.commissionTierId;
      state.rewardWithPopoverOpen = false;
    },
  },
});

export const {
  setDialogOpen,
  setTimeBound,
  setEndDate,
  setEventPopoverOpen,
  chooseRewardEventDraft,
  setDraftSales,
  commitRewardEventDraft,
  setRewardWithPopoverOpen,
  chooseRewardWithDraft,
  setDraftBonusAmount,
  commitRewardWithDraft,
  openCommissionRewardFlow,
  setCommissionTierDraftId,
  saveCommissionTierStep,
  cancelCommissionTierStep,
  openCommissionTierStepForEdit,
} = gamificationModalSlice.actions;

export const selectDialogOpen = (state) => state.gamificationModal.dialogOpen;
export const selectRewardEvent = (state) => state.gamificationModal.rewardEvent;
export const selectSalesThreshold = (state) =>
  state.gamificationModal.salesThreshold;
export const selectRewardWith = (state) => state.gamificationModal.rewardWith;
export const selectBonusAmount = (state) => state.gamificationModal.bonusAmount;
export const selectCommissionTierId = (state) =>
  state.gamificationModal.commissionTierId;
export const selectCommissionTierStepActive = (state) =>
  state.gamificationModal.commissionTierStepActive;
export const selectCommissionTierDraftId = (state) =>
  state.gamificationModal.commissionTierDraftId;
export const selectIsTimeBound = (state) => state.gamificationModal.isTimeBound;
export const selectEndDate = (state) => state.gamificationModal.endDate;
export const selectEventPopoverOpen = (state) =>
  state.gamificationModal.eventPopoverOpen;
export const selectDraftEvent = (state) => state.gamificationModal.draftEvent;
export const selectDraftSales = (state) => state.gamificationModal.draftSales;
export const selectEventPopoverFooterVisible = (state) =>
  state.gamificationModal.eventPopoverFooterVisible;
export const selectRewardWithPopoverOpen = (state) =>
  state.gamificationModal.rewardWithPopoverOpen;
export const selectDraftRewardWith = (state) =>
  state.gamificationModal.draftRewardWith;
export const selectDraftBonusAmount = (state) =>
  state.gamificationModal.draftBonusAmount;
export const selectRewardWithFooterVisible = (state) =>
  state.gamificationModal.rewardWithFooterVisible;

export default gamificationModalSlice.reducer;
