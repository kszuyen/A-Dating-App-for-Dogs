"use client";

import { createEdgeStoreProvider } from "@edgestore/react";

import { type EdgeStoreRouter } from "@/app/api/edgestore/[...edgestore]/route";

export const { EdgeStoreProvider, useEdgeStore } =
  createEdgeStoreProvider<EdgeStoreRouter>({
    maxConcurrentUploads: 2,
  });
