import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Search } from "lucide-react";

export default function GradingLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-2xl transition-all">
      <div className="relative flex items-center justify-center">
        {/* 1. The "Scanning" Ring */}
        <motion.div
          className="absolute w-40 h-40 rounded-full border border-primary/20"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* 2. Success Pulse (Simulating Correct Verification) */}
        <motion.div
          className="absolute w-32 h-32 rounded-full bg-success/5"
          animate={{
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* 3. Central Analysis Hub */}
        <motion.div
          className="relative z-10 flex items-center justify-center w-20 h-20 bg-card rounded-2xl shadow-2xl border border-border"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="relative">
            <CheckCircle2 className="w-10 h-10 text-success" />

            {/* The Scanning Line Effect */}
            <motion.div
              className="absolute top-0 left-0 w-full h-0.5 bg-success shadow-[0_0_15px_rgba(34,197,94,0.8)]"
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>
        </motion.div>

        {/* 4. Peripheral "Data Particles" */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-primary/40 rounded-full"
            animate={{
              x: [0, i % 2 === 0 ? 60 : -60],
              y: [0, i < 2 ? 60 : -60],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* 5. Dynamic Analysis Text */}
      <motion.div
        className="mt-12 text-center space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h3 className="text-xl font-semibold text-foreground tracking-tight flex items-center justify-center gap-2">
          <motion.span
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 3, times: [0, 0.5, 1] }}
          >
            Evaluating Answers...
          </motion.span>
        </h3>

        <div className="flex flex-col gap-1">
          <p className="text-xs text-muted-foreground/60 italic">
            Think you did better than last time?
          </p>
        </div>
      </motion.div>
    </div>
  );
}
