"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { CalculatorWidget } from "@/components/widgets/calculator-widget";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PasswordGen() {
  const [len, setLen] = useState(16);
  const [pwd, setPwd] = useState("");
  const generate = () => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let p = "";
    for (let i = 0; i < len; i++) p += chars[Math.floor(Math.random() * chars.length)];
    setPwd(p);
  };
  return (
    <div className="space-y-3">
      <Input type="number" value={len} onChange={(e) => setLen(Number(e.target.value))} min={8} max={64} />
      <Button onClick={generate}>Generate</Button>
      {pwd && (
        <div className="flex gap-2">
          <Input readOnly value={pwd} className="font-mono text-xs" />
          <Button variant="secondary" onClick={() => { navigator.clipboard.writeText(pwd); toast.success("Copied!"); }}>Copy</Button>
        </div>
      )}
    </div>
  );
}

function QRGen() {
  const [text, setText] = useState("https://dailyos.app");
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
  return (
    <div className="space-y-3">
      <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="URL or text" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="QR Code" className="mx-auto rounded-xl bg-white p-2" width={200} height={200} />
    </div>
  );
}

function JsonFormatter() {
  const [input, setInput] = useState('{"hello":"world"}');
  const [output, setOutput] = useState("");
  const format = () => {
    try {
      setOutput(JSON.stringify(JSON.parse(input), null, 2));
      toast.success("Formatted!");
    } catch {
      toast.error("Invalid JSON");
    }
  };
  return (
    <div className="space-y-3">
      <Textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4} className="font-mono text-xs" />
      <Button onClick={format}>Format</Button>
      {output && <Textarea readOnly value={output} rows={6} className="font-mono text-xs" />}
    </div>
  );
}

function ColorPicker() {
  const [color, setColor] = useState("#22d3ee");
  return (
    <div className="space-y-3">
      <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-12 w-full cursor-pointer rounded-xl" />
      <Input value={color} onChange={(e) => setColor(e.target.value)} />
      <div className="h-24 rounded-xl" style={{ background: color }} />
    </div>
  );
}

function CharCounter() {
  const [text, setText] = useState("");
  return (
    <div className="space-y-3">
      <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} />
      <p className="text-sm text-white/50">
        {text.length} chars · {text.split(/\s+/).filter(Boolean).length} words
      </p>
    </div>
  );
}

function RandomPicker() {
  const [items, setItems] = useState("Option A\nOption B\nOption C");
  const [pick, setPick] = useState("");
  const pickRandom = () => {
    const list = items.split("\n").filter(Boolean);
    if (!list.length) return;
    setPick(list[Math.floor(Math.random() * list.length)]!);
  };
  return (
    <div className="space-y-3">
      <Textarea value={items} onChange={(e) => setItems(e.target.value)} rows={4} />
      <Button onClick={pickRandom}>Pick random</Button>
      {pick && <p className="text-center text-xl font-bold text-cyan-400">{pick}</p>}
    </div>
  );
}

function UtilitiesContent() {
  const params = useSearchParams();
  const activeTool = params.get("tool") === "calculator" ? "calculator" : "password";

  return (
    <AppShell title="Quick Tools">
      <p className="page-subtitle -mt-2 mb-6 max-w-xl">
        Small daily utilities, kept close so you do not have to break flow.
      </p>
      <Tabs defaultValue={activeTool} className="w-full">
        <TabsList className="mobile-scroll-row mb-6 flex w-full justify-start gap-1 overflow-x-auto bg-white/5 p-1">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="qr">QR Code</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
          <TabsTrigger value="color">Color</TabsTrigger>
          <TabsTrigger value="chars">Counter</TabsTrigger>
          <TabsTrigger value="random">Random</TabsTrigger>
        </TabsList>
        <GlassPanel className="p-4 sm:p-6">
          <TabsContent value="calculator">
            <div className="mx-auto h-80 max-w-sm">
              <CalculatorWidget />
            </div>
          </TabsContent>
          <TabsContent value="password"><PasswordGen /></TabsContent>
          <TabsContent value="qr"><QRGen /></TabsContent>
          <TabsContent value="json"><JsonFormatter /></TabsContent>
          <TabsContent value="color"><ColorPicker /></TabsContent>
          <TabsContent value="chars"><CharCounter /></TabsContent>
          <TabsContent value="random"><RandomPicker /></TabsContent>
        </GlassPanel>
      </Tabs>
    </AppShell>
  );
}

export default function UtilitiesPage() {
  return (
    <Suspense>
      <UtilitiesContent />
    </Suspense>
  );
}
