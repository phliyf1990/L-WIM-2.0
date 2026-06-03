
import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, Sparkles, Sliders, Layers, Database, 
  ArrowRight, Loader2, X, Target, Ruler,
  AlertTriangle, Box, Activity, TrendingDown, ChevronRight,
  Search, ShieldCheck, Microscope, Zap, Terminal, Code, Clipboard,
  FunctionSquare, Cpu
} from 'lucide-react';
import { GeminiService } from './services/geminiService';
import { StyleVector, ProcessingStep } from './types';
import { ALL_SAMPLES_TENSORS, INITIAL_STYLE, SAMPLE_LABELS, STYLE_ANCHORS } from './constants';
import { RadarChart } from './components/RadarChart';
import { CompassDial } from './components/CompassDial';
import { ManifoldChart } from './components/ManifoldChart';

const App: React.FC = () => {
  const [step, setStep] = useState<ProcessingStep>(ProcessingStep.IDLE);
  const [activeSample, setActiveSample] = useState(1);
  const [selectedAnchorId, setSelectedAnchorId] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [styleVector, setStyleVector] = useState<StyleVector>(INITIAL_STYLE);
  const [currentAngle, setCurrentAngle] = useState(90);
  const [optimalAngle, setOptimalAngle] = useState(0);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [semanticPrompt, setSemanticPrompt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  
  const geminiRef = useRef<GeminiService>(new GeminiService());

  useEffect(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 500);
    }
  }, []);

  const currentSampleTensors = ALL_SAMPLES_TENSORS[activeSample];
  const selectedAnchor = STYLE_ANCHORS.find(a => a.id === selectedAnchorId);

  // 4.2 Core Algorithm Implementation: ΔV Calculation
  const calcEuclidean = (v1: StyleVector, v2: StyleVector) => {
    return Math.sqrt(
      (Math.pow(v1.variety - v2.variety, 2) +
       Math.pow(v1.gorgeousness - v2.gorgeousness, 2) +
       Math.pow(v1.dynamism - v2.dynamism, 2) +
       Math.pow(v1.intensity - v2.intensity, 2) +
       Math.pow(v1.interest - v2.interest, 2)) / 5
    );
  };

  const manifoldData = currentSampleTensors.map(t => ({
    angle: t.angle,
    loss: calcEuclidean(styleVector, t.v_wood)
  }));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);
      setGeneratedImage(null);
      setSemanticPrompt(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setUploadedImage(base64);
        analyzeStyle(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeStyle = async (image: string) => {
    setStep(ProcessingStep.ENCODING_TARGET);
    try {
      const vector = await geminiRef.current.encodeTargetStyle(image);
      setStyleVector(vector);
      
      let minLoss = Infinity;
      let closestAnchor = STYLE_ANCHORS[0].id;
      STYLE_ANCHORS.forEach(anchor => {
        const loss = calcEuclidean(vector, anchor.vector);
        if (loss < minLoss) {
          minLoss = loss;
          closestAnchor = anchor.id;
        }
      });
      setSelectedAnchorId(closestAnchor);
    } catch (err: any) {
      setError("Phase 1: Asset extraction failed.");
    } finally {
      setStep(ProcessingStep.IDLE);
    }
  };

  const runScanning = async () => {
    if (!uploadedImage) return;
    setIsScanning(true);
    setSemanticPrompt(null);
    let bestAngle = 0;
    let minDistance = Infinity;

    // Simulating the scanning optimization process described in chapter 4.2
    for (let i = 0; i <= 180; i += 10) {
      setCurrentAngle(i);
      await new Promise(r => setTimeout(r, 40));
    }

    currentSampleTensors.forEach(wood => {
      const distance = calcEuclidean(styleVector, wood.v_wood);
      if (distance < minDistance) {
        minDistance = distance;
        bestAngle = wood.angle;
      }
    });

    setOptimalAngle(bestAngle);
    setCurrentAngle(bestAngle);
    
    const wood = currentSampleTensors.find(w => w.angle === bestAngle) || currentSampleTensors[0];
    const promptText = await geminiRef.current.generateSemanticPrompt(styleVector, wood);
    setSemanticPrompt(promptText);
    
    setIsScanning(false);
  };

  const handleGenerate = async () => {
    if (!uploadedImage || !semanticPrompt) return;
    setStep(ProcessingStep.OPTIMIZING);
    try {
      setStep(ProcessingStep.GENERATING);
      const url = await geminiRef.current.generateFurniture(semanticPrompt, uploadedImage);
      setGeneratedImage(url);
    } catch (err: any) {
      setError("Phase 3: Synthesis pipeline failed.");
    } finally {
      setStep(ProcessingStep.IDLE);
    }
  };

  const currentWoodVector = currentSampleTensors.find(w => w.angle === currentAngle)?.v_wood;
  const semanticLoss = currentWoodVector ? calcEuclidean(styleVector, currentWoodVector) : 1;
  const letterLabels: Record<number, string> = { 1: "A", 2: "B", 3: "C", 4: "D", 5: "E" };

  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-200 selection:bg-amber-500/30 font-sans tracking-tight">
      <nav className="border-b border-stone-900 bg-stone-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-900/20">
              <Cpu className="text-stone-950 w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tighter leading-none uppercase">L-WIM<span className="text-amber-500">.Platform</span></span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500 font-bold">Phoebe Zhennan AI Design System</span>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end mr-4">
               <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Active Material Tensor</span>
               <span className="text-[11px] font-mono text-amber-500/80">{SAMPLE_LABELS[activeSample]}</span>
            </div>
            <div className="flex items-center gap-2">
               {[1,2,3,4,5].map(id => (
                 <button 
                  key={id}
                  onClick={() => setActiveSample(id)}
                  className={`w-9 h-9 rounded-lg text-[11px] font-black transition-all border flex flex-col items-center justify-center ${activeSample === id ? 'bg-amber-500 text-stone-950 border-amber-400 scale-110 shadow-lg shadow-amber-500/20' : 'bg-stone-900 text-stone-500 border-stone-800 hover:border-stone-600'}`}
                 >
                   <span>{letterLabels[id]}</span>
                 </button>
               ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Phase 1 & 2 Column */}
        <div className="lg:col-span-4 space-y-10">
          <section className="bg-stone-900/40 border border-stone-800/60 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Database className="w-12 h-12" />
            </div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-500 mb-6 flex items-center gap-2">
              <Target className="w-4 h-4" /> 4.1 Data Assetization & Perception Engine
            </h2>
            
            <label className={`
              flex flex-col items-center justify-center w-full aspect-square rounded-[1.5rem] border-2 border-dashed 
              transition-all cursor-pointer overflow-hidden relative mb-6
              ${uploadedImage ? 'border-amber-500/40 bg-amber-500/[0.02]' : 'border-stone-800 hover:border-stone-700 bg-stone-900/50'}
            `}>
              {uploadedImage ? (
                <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-stone-950 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-stone-800 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-stone-500" />
                  </div>
                  <p className="text-[10px] text-stone-400 font-mono uppercase tracking-widest">Identify Target Geometry F'</p>
                </div>
              )}
              <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
            </label>

            {selectedAnchor && (
              <div className="bg-stone-950/50 rounded-2xl p-4 border border-indigo-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Perception Encoding: {selectedAnchor.nameEn}</span>
                  <div className="px-2 py-0.5 bg-indigo-500/10 rounded text-[8px] font-bold text-indigo-300">ResNet-VSpace</div>
                </div>
                <RadarChart targetData={styleVector} woodData={currentWoodVector} anchorData={selectedAnchor.vector} />
              </div>
            )}
          </section>

          <section className="bg-stone-900/40 border border-stone-800/60 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Microscope className="w-12 h-12" />
            </div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-500 mb-6 flex items-center gap-2">
              <Search className="w-4 h-4" /> 4.2 Semantic Inference & Optimization
            </h2>
            
            <div className="space-y-6">
              <button 
                onClick={runScanning}
                disabled={!uploadedImage || isScanning}
                className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${isScanning ? 'bg-emerald-500/20 text-emerald-300' : 'bg-stone-950 hover:bg-stone-800 border border-stone-800'}`}
              >
                {isScanning ? <Microscope className="w-4 h-4 animate-pulse" /> : <Microscope className="w-4 h-4" />}
                {isScanning ? 'Executing ΔV Manifold Scan...' : 'Start θ* Optimization Scan'}
              </button>

              <div className="bg-stone-950/30 rounded-2xl p-6 border border-stone-800/50 relative">
                {isScanning && (
                  <div className="absolute inset-0 bg-emerald-500/5 backdrop-blur-[1px] rounded-2xl flex items-center justify-center z-10">
                    <div className="text-[10px] font-black text-emerald-400 animate-pulse tracking-widest uppercase">Goniometric Probe Active...</div>
                  </div>
                )}
                <CompassDial value={currentAngle} onChange={setCurrentAngle} optimalValue={optimalAngle} />
              </div>
            </div>
          </section>
        </div>

        {/* Phase 3 & 4 Column */}
        <div className="lg:col-span-8 space-y-10">
          <section className="bg-stone-900/40 border border-stone-800/60 rounded-[2rem] p-10 shadow-2xl relative">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Activity className="w-16 h-16" />
            </div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-500 mb-8 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> 4.2 Optimization Results (Loss Minimization)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <ManifoldChart data={manifoldData} currentAngle={currentAngle} optimalAngle={optimalAngle} />
                <div className="p-5 bg-stone-950/50 rounded-2xl border border-stone-800/50 border-l-4 border-l-emerald-500">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingDown className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest italic">Semantic Loss ΔV(θ)</span>
                  </div>
                  <p className="text-[11px] text-stone-500 leading-relaxed font-serif">
                    Physical observation and aesthetic intent resonate at θ={optimalAngle}°.
                    This angle effectively compresses semantic deviation ΔV to {semanticLoss.toFixed(4)}, achieving maximum activation of material potential.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                    <span className="text-[8px] text-emerald-500/70 font-black uppercase tracking-widest block mb-1">Resonance (1-ΔV)</span>
                    <span className="text-xl font-mono text-emerald-400 font-bold tracking-tighter">{((1 - semanticLoss) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                    <span className="text-[8px] text-amber-500/70 font-black uppercase tracking-widest block mb-1">Optical Lock θ*</span>
                    <span className="text-xl font-mono text-amber-400 font-bold tracking-tighter">{currentAngle}°</span>
                  </div>
                </div>
                <div className="p-6 bg-stone-950/80 rounded-2xl border border-stone-800 shadow-xl">
                   <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                     <Cpu className="w-3 h-3 text-indigo-500" /> Decision Matrix
                   </h3>
                   <div className="space-y-2">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-stone-600">Form Consistency (F')</span>
                        <span className="text-emerald-500 font-bold">MATCHED</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-stone-600">Material Chatoyancy (W)</span>
                        <span className="text-emerald-500 font-bold">OPTIMIZED</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-stone-600">Convergence Speed</span>
                        <span className="text-stone-400 font-mono">1.2ms</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4.2 Core: Knowledge Encoding Panel */}
          <section className={`bg-stone-950 border border-stone-800 rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-700 ${semanticPrompt ? 'max-h-[800px] opacity-100 p-8' : 'max-h-0 opacity-0 p-0 pointer-events-none'}`}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-indigo-400" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-400">
                   4.2 Knowledge Codification
                </h2>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded text-[8px] font-bold text-indigo-400 uppercase tracking-widest">
                <FunctionSquare className="w-3 h-3" /> PMPM Protocol v3.0
              </div>
            </div>

            <div className="mb-6 p-4 bg-stone-900/50 rounded-xl border border-stone-800 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[8px] text-stone-500 font-black uppercase tracking-widest">Optimization Formula</span>
                <span className="text-[11px] font-mono text-indigo-300 italic tracking-tighter">θ* = arg min || V_target - V_wood(θ) ||₂</span>
              </div>
              <div className="text-[10px] text-stone-600 font-serif">Tripartite Mechanism</div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
               {semanticPrompt?.split('\n').filter(line => line.includes('[')).map((line, idx) => {
                 const [label, content] = line.replace(/[\[\]]/g, '').split(': ');
                 const colorClass = label?.includes('Lighting') ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 
                                   label?.includes('Wood') ? 'text-amber-400 border-amber-500/20 bg-amber-500/5' : 
                                   'text-indigo-400 border-indigo-500/20 bg-indigo-500/5';
                 
                 return (
                   <div key={idx} className={`p-6 rounded-2xl border ${colorClass} transition-all hover:scale-[1.01]`}>
                      <div className="flex items-center gap-2 mb-2 opacity-60">
                        <Code className="w-3 h-3" />
                        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
                      </div>
                      <p className="text-[12px] leading-relaxed font-mono">{content || "Executing PMPM Logic..."}</p>
                   </div>
                 );
               })}
            </div>

            {semanticPrompt && (
              <div className="mt-8 pt-8 border-t border-stone-900 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-stone-700" />
                  <span className="text-[9px] text-stone-700 uppercase tracking-widest font-mono italic">Knowledge-Injected AIGC Instruction Set</span>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(semanticPrompt || '');
                    alert('L-WIM Protocol Ready');
                  }}
                  className="px-6 py-2 bg-stone-900 hover:bg-stone-800 rounded-full text-[9px] font-black uppercase tracking-widest text-stone-400 border border-stone-800 flex items-center gap-2 transition-all"
                >
                  <Clipboard className="w-3 h-3" /> Copy Full Protocol
                </button>
              </div>
            )}
          </section>

          {/* Chapter 4.3: Generative Visualization */}
          <section className="bg-stone-900/60 border border-stone-800 rounded-[2.5rem] p-10 shadow-2xl min-h-[500px] flex flex-col relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8">
                <Zap className="w-8 h-8 text-amber-500/10 animate-pulse" />
             </div>
             
             <div className="flex items-center justify-between mb-10">
              <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-500 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> 4.3 Generative Visualization (Synthesis)
              </h2>
              
              {step !== ProcessingStep.IDLE && (
                <div className="px-5 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center gap-3">
                  <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                    {step === ProcessingStep.GENERATING ? "Executing AIGC High-Fidelity Rendering..." : "Aligning Physical Texture Assets..."}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 bg-[#050505] rounded-[2rem] border border-stone-800 overflow-hidden relative shadow-inner group/preview min-h-[400px]">
              {generatedImage ? (
                <img src={generatedImage} alt="Generated" className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-1000" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center">
                  <Box className="w-20 h-20 text-stone-900 mb-6" />
                  <h3 className="text-[10px] font-black text-stone-700 uppercase tracking-[0.4em]">Resonance Preview</h3>
                  <p className="text-[9px] text-stone-800 mt-4 max-w-xs font-mono uppercase tracking-widest leading-relaxed">
                    System awaiting optimization instructions (PMPM). After completing the first three steps, click below to activate generative synthesis pipeline.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-10">
              <button
                onClick={handleGenerate}
                disabled={!uploadedImage || !semanticPrompt || step !== ProcessingStep.IDLE || isScanning}
                className={`
                  w-full py-8 rounded-2xl font-black text-[14px] uppercase tracking-[0.5em] flex items-center justify-center gap-4 transition-all
                  ${!uploadedImage || !semanticPrompt || step !== ProcessingStep.IDLE || isScanning
                    ? 'bg-stone-900 text-stone-800 border border-stone-800 cursor-not-allowed opacity-50' 
                    : 'bg-gradient-to-r from-amber-400 to-amber-600 text-stone-950 hover:shadow-2xl hover:shadow-amber-500/40 active:scale-[0.98] shadow-lg shadow-amber-900/10'}
                `}
              >
                Activate Final Synthesis Pipeline <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </section>
        </div>
      </main>

      {error && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-950 border border-red-500/50 text-red-200 px-8 py-4 rounded-2xl flex items-center gap-4 shadow-2xl z-[100] animate-in slide-in-from-bottom-5">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <span className="text-xs font-bold uppercase tracking-widest">{error}</span>
          <button onClick={() => setError(null)} className="ml-4 hover:bg-white/10 rounded-full p-1 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
