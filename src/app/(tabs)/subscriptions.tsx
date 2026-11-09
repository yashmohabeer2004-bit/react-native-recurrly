import { useState } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';
import { styled } from "nativewind";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import SubscriptionCard from "../../../components/SubscriptionCard";
import { useSubscriptions } from "../../context/subscriptions";

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
    const { subscriptions } = useSubscriptions();

    const filteredSubscriptions = subscriptions.filter((sub) => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        return (
            sub.name.toLowerCase().includes(query) ||
            (sub.plan && sub.plan.toLowerCase().includes(query)) ||
            (sub.category && sub.category.toLowerCase().includes(query))
        );
    });

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <Text className="mb-4 text-2xl font-sans-bold text-primary">Subscriptions</Text>

            <View className="flex-1">
                <TextInput
                    className="mb-4 rounded-2xl border border-border bg-card px-4 py-3 text-base font-sans-medium text-primary"
                    placeholder="Search subscriptions..."
                    placeholderTextColor="rgba(0, 0, 0, 0.6)"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    clearButtonMode="while-editing"
                />

                <FlatList
                    data={filteredSubscriptions}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <SubscriptionCard
                            {...item}
                            expanded={expandedSubscriptionId === item.id}
                            onPress={() =>
                                setExpandedSubscriptionId((currentId) =>
                                    currentId === item.id ? null : item.id
                                )
                            }
                        />
                    )}
                    extraData={expandedSubscriptionId}
                    ItemSeparatorComponent={() => <View className="h-4" />}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Text className="py-4 text-sm font-sans-medium text-black/60">
                            {searchQuery ? 'No subscriptions match your search.' : 'No subscriptions yet.'}
                        </Text>
                    }
                    contentContainerClassName="pb-20"
                />
            </View>
        </SafeAreaView>
    );
}

export default Subscriptions;
