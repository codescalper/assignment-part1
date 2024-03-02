import {create} from 'zustand';

interface NetworkState {
    isNetwork:string,
    setIsNetwork: (network:string) => void
    }

export const useNetwork = create<NetworkState>((set) => ({
    isNetwork: "ethereum",
    setIsNetwork: (isNetwork:string) => set({isNetwork})
    }));