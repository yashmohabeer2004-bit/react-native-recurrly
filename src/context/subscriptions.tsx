import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { HOME_SUBSCRIPTIONS } from "../../constants/data";

interface SubscriptionsContextType {
    subscriptions: Subscription[];
    addSubscription: (subscription: Subscription) => void;
}

const SubscriptionsContext = createContext<SubscriptionsContextType | undefined>(undefined);

export function SubscriptionsProvider({ children }: { children: ReactNode }) {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>(HOME_SUBSCRIPTIONS);

    const addSubscription = useCallback((subscription: Subscription) => {
        setSubscriptions((prev: Subscription[]) => [subscription, ...prev]);
    }, []);

    return (
        <SubscriptionsContext.Provider value={{ subscriptions, addSubscription }}>
            {children}
        </SubscriptionsContext.Provider>
    );
}

export function useSubscriptions() {
    const context = useContext(SubscriptionsContext);
    if (context === undefined) {
        throw new Error("useSubscriptions must be used within a SubscriptionsProvider");
    }
    return context;
}
