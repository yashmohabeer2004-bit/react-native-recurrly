import { useState, useCallback } from "react";
import { Modal, View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { styled } from "nativewind";
import clsx from "clsx";
import dayjs from "dayjs";
import { icons } from "../../constants/icons";

const SN = styled(View);
const SNText = styled(Text);
const SNTextInput = styled(TextInput);

const CATEGORIES = [
    "Entertainment",
    "AI Tools",
    "Developer Tools",
    "Design",
    "Productivity",
    "Cloud",
    "Music",
    "Other",
] as const;

const CATEGORY_COLORS: Record<string, string> = {
    Entertainment: "#f5c542",
    "AI Tools": "#b8d4e3",
    "Developer Tools": "#e8def8",
    Design: "#f5a0a0",
    Productivity: "#a0d4f5",
    Cloud: "#a0f5c5",
    Music: "#d4a0f5",
    Other: "#f6eecf",
};

interface CreateSubscriptionModalProps {
    visible: boolean;
    onClose: () => void;
    onCreate: (subscription: Subscription) => void;
}

export default function CreateSubscriptionModal({ visible, onClose, onCreate }: CreateSubscriptionModalProps) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [frequency, setFrequency] = useState<"Monthly" | "Yearly">("Monthly");
    const [category, setCategory] = useState<string | null>(null);

    const nameError = name.trim().length === 0 ? "Name is required" : null;
    const priceNum = parseFloat(price);
    const priceError =
        price.length === 0
            ? "Price is required"
            : Number.isNaN(priceNum) || priceNum <= 0
            ? "Enter a valid price"
            : null;

    const isValid = name.trim().length > 0 && !Number.isNaN(priceNum) && priceNum > 0 && category !== null;

    const resetForm = useCallback(() => {
        setName("");
        setPrice("");
        setFrequency("Monthly");
        setCategory(null);
    }, []);

    const handleClose = useCallback(() => {
        resetForm();
        onClose();
    }, [resetForm, onClose]);

    const handleSubmit = useCallback(() => {
        if (!isValid) return;

        const now = dayjs();
        const startDate = now.toISOString();
        const renewalDate =
            frequency === "Yearly"
                ? now.add(1, "year").toISOString()
                : now.add(1, "month").toISOString();

        const subscription: Subscription = {
            id: `${name.trim().toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
            name: name.trim(),
            price: priceNum,
            currency: "USD",
            billing: frequency,
            category,
            status: "active",
            startDate,
            renewalDate,
            icon: icons.wallet,
            color: CATEGORY_COLORS[category ?? ""] ?? CATEGORY_COLORS.Other,
        };

        onCreate(subscription);
        resetForm();
        onClose();
    }, [name, priceNum, frequency, category, isValid, onCreate, resetForm, onClose]);

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
            <View className="modal-overlay">
                <SN className="modal-container">
                    <View className="modal-header">
                        <SNText className="modal-title">New Subscription</SNText>
                        <Pressable onPress={handleClose} className="modal-close">
                            <SNText className="modal-close-text">×</SNText>
                        </Pressable>
                    </View>

                    <ScrollView className="modal-body" keyboardShouldPersistTaps="handled">
                        {/* Name */}
                        <View className="auth-field">
                            <SNText className="auth-label">Name</SNText>
                            <SNTextInput
                                className={clsx("auth-input", nameError && "auth-input-error")}
                                placeholder="e.g. Spotify"
                                value={name}
                                onChangeText={setName}
                            />
                            {nameError && <SNText className="auth-error">{nameError}</SNText>}
                        </View>

                        {/* Price */}
                        <View className="auth-field">
                            <SNText className="auth-label">Price</SNText>
                            <SNTextInput
                                className={clsx("auth-input", priceError && "auth-input-error")}
                                placeholder="0.00"
                                value={price}
                                onChangeText={setPrice}
                                keyboardType="decimal-pad"
                            />
                            {priceError && <SNText className="auth-error">{priceError}</SNText>}
                        </View>

                        {/* Frequency */}
                        <View className="auth-field">
                            <SNText className="auth-label">Frequency</SNText>
                            <View className="picker-row">
                                {(["Monthly", "Yearly"] as const).map((option) => (
                                    <Pressable
                                        key={option}
                                        onPress={() => setFrequency(option)}
                                        className={clsx(
                                            "picker-option",
                                            frequency === option && "picker-option-active"
                                        )}
                                    >
                                        <SNText
                                            className={clsx(
                                                "picker-option-text",
                                                frequency === option && "picker-option-text-active"
                                            )}
                                        >
                                            {option}
                                        </SNText>
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        {/* Category */}
                        <View className="auth-field">
                            <SNText className="auth-label">Category</SNText>
                            <View className="category-scroll">
                                {CATEGORIES.map((cat) => (
                                    <Pressable
                                        key={cat}
                                        onPress={() => setCategory(cat)}
                                        className={clsx(
                                            "category-chip",
                                            category === cat && "category-chip-active"
                                        )}
                                    >
                                        <SNText
                                            className={clsx(
                                                "category-chip-text",
                                                category === cat && "category-chip-text-active"
                                            )}
                                        >
                                            {cat}
                                        </SNText>
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        {/* Submit */}
                        <Pressable
                            onPress={handleSubmit}
                            disabled={!isValid}
                            className={clsx("auth-button", !isValid && "auth-button-disabled")}
                        >
                            <SNText className="auth-button-text">Create Subscription</SNText>
                        </Pressable>
                    </ScrollView>
                </SN>
            </View>
        </Modal>
    );
}
