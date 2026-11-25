"use client";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { CartDrawer } from "./cart-drawer";
import { QuickView } from "./quick-view";
import { SearchDialog } from "./search-dialog";
import { useStore } from "./store-provider";
export function Overlays() {
  const { toast } = useStore();
  return (
    <>
      <CartDrawer />
      <QuickView />
      <SearchDialog />
      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            role="status"
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
          >
            <CheckCircle2 size={19} />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
