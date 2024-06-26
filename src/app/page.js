"use client";
import React, { useState, useEffect } from "react";
import SearchBar from "@/components/Search";
import MainLayout from "@/components/layouts";
import { useDispatch } from 'react-redux';
import { setNet } from '@/redux/netSlice';

export default function Home() {
    const dispatch = useDispatch();

    const handleSetNet = (net) => {
        dispatch(setNet(net));
    };
    return (
        <MainLayout>
            <SearchBar setParNet={handleSetNet} />
        </MainLayout>
    );
}

