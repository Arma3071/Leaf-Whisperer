import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface ScanRecord {
  id: string;
  plant: string;
  disease: string;
  severity: string;
  confidence: string;
  recommendations: string[] | null;
  image_url: string | null;
  created_at: string;
}

export function useScanHistory() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["scan-history", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scan_history")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ScanRecord[];
    },
  });

  const saveScan = useMutation({
    mutationFn: async (scan: {
      plant: string;
      disease: string;
      severity: string;
      confidence: string;
      recommendations?: string[];
      image_url?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("scan_history").insert({
        user_id: user.id,
        ...scan,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scan-history"] }),
  });

  const deleteScan = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("scan_history").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["scan-history"] }),
  });

  return { scans: query.data ?? [], loading: query.isLoading, saveScan, deleteScan };
}
