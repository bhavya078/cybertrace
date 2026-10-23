'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle } from '@/components/Card';
import { Button } from '@/components/Button';
import {
  Upload,
  Image as ImageIcon,
  ShieldCheck,
  AlertCircle,
  FileCheck2,
  Lock,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from '@/lib/constants';
import { formatBytes } from '@/lib/utils';
import { SYNTHETIC_FIXTURE_PRESETS, SyntheticFixturePreset } from '@/lib/fixtures';

export default function InvestigatePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileSha256, setFileSha256] = useState<string>('');
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isSynthetic, setIsSynthetic] = useState(false);

  // Status & Validation states
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalculatingHash, setIsCalculatingHash] = useState(false);

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Compute SHA-256 in browser using Web Crypto API
  const calculateSha256 = async (blob: Blob): Promise<string> => {
    const buffer = await blob.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  };

  // Verify file magic bytes on client before proceeding
  const verifyMagicBytes = async (fileObj: File): Promise<boolean> => {
    try {
      const slice = await fileObj.slice(0, 12).arrayBuffer();
      const bytes = new Uint8Array(slice);
      if (bytes.length < 4) return false;

      // JPEG: FF D8 FF
      if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return true;
      // PNG: 89 50 4E 47 0D 0A 1A 0A
      if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return true;
      // WebP: RIFF ... WEBP
      if (
        bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
        bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
      ) return true;

      return false;
    } catch {
      return false;
    }
  };

  const handleFileProcess = async (selectedFile: File) => {
    setError(null);

    // Validate declared MIME type
    if (!ACCEPTED_IMAGE_TYPES.includes(selectedFile.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
      setError(`Invalid file format. Accepted types: ${ACCEPTED_IMAGE_TYPES.map((t) => t.replace('image/', '.')).join(', ')}`);
      return;
    }

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setError(`File exceeds maximum size limit of ${MAX_FILE_SIZE_MB}MB (${formatBytes(selectedFile.size)})`);
      return;
    }

    // Verify true magic byte signature
    const isValidSignature = await verifyMagicBytes(selectedFile);
    if (!isValidSignature) {
      setError('File content signature does not match a genuine JPEG, PNG, or WebP image. Intake rejected.');
      return;
    }

    // Revoke previous blob URL if needed
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    setFile(selectedFile);
    setIsSynthetic(false);
    if (!title) {
      setTitle(`Investigation: ${selectedFile.name.replace(/\.[^/.]+$/, '')}`);
    }

    // Ephemeral in-memory preview without server transmission
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    // Measure dimensions
    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = objectUrl;

    // Calculate SHA-256
    setIsCalculatingHash(true);
    try {
      const hash = await calculateSha256(selectedFile);
      setFileSha256(hash);
    } catch {
      setError('Unable to compute cryptographic hash for the file.');
    } finally {
      setIsCalculatingHash(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleSelectPreset = (preset: SyntheticFixturePreset) => {
    setError(null);
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setTitle(preset.name);
    setDescription(preset.description);
    setPreviewUrl(preset.sampleSvgPreview);
    setFileSha256(preset.sha256Hash);
    setImageDimensions({ width: preset.width, height: preset.height });
    setIsSynthetic(true);
  };

  const handleSubmitCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Case title is required.');
      return;
    }

    if (!previewUrl || !fileSha256) {
      setError('Please select an image file or choose a synthetic fixture first.');
      return;
    }

    try {
      setIsSubmitting(true);

      // Security & Privacy: We only transmit sanitized case metadata, zero image binaries or Base64 data URLs!
      const payload = {
        title: title.trim(),
        description: description.trim(),
        fileName: file ? file.name : `${title.toLowerCase().replace(/\s+/g, '_')}.png`,
        mimeType: file ? file.type : 'image/png',
        fileSize: file ? file.size : 1024 * 500,
        width: imageDimensions?.width || 800,
        height: imageDimensions?.height || 800,
        sha256Hash: fileSha256,
        isSyntheticFixture: isSynthetic,
      };

      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to initialize case');
      }

      // Navigate to the newly created case detail workbench
      router.push(`/cases/${data.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error submitting case');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="pb-6 border-b border-[#1b2230] space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>INTAKE & TRIAGE PROTOCOL</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Initiate Visual Forensic Case
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Upload a suspicious image or pick a synthetic sample to analyze manipulation indicators and discover syndication.
        </p>
      </div>

      {/* Ephemeral Privacy Notice */}
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-4 flex items-start gap-3">
        <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-slate-300">
          <div className="font-semibold text-emerald-300">Client-Side Privacy Guarantee</div>
          <p className="text-slate-400 leading-relaxed">
            Victim visual media is processed and previewed within your local browser sandbox. Image binaries are <strong>never stored permanently on the server</strong>. Only extracted mathematical indicators and the 64-character SHA-256 fingerprint are transmitted to the case record.
          </p>
        </div>
      </div>

      {/* Synthetic Fixtures Carousel / Quick Selector */}
      <Card className="border-[#222a3a] bg-[#0c0e14]">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#181d28]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200">
              Demo Test Fixtures (Zero-Risk Presets)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Click to instantly populate</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SYNTHETIC_FIXTURE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="text-left p-3 rounded-lg bg-[#11141d] hover:bg-[#161c28] border border-[#1e2534] hover:border-emerald-500/40 transition-all group"
            >
              <div className="font-semibold text-xs text-white group-hover:text-emerald-400 transition-colors">
                {preset.name}
              </div>
              <div className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                {preset.tagline}
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Main Intake Form */}
      <form onSubmit={handleSubmitCase} className="space-y-6">
        {/* Dropzone & Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* File Dropzone */}
          <Card
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`border-2 border-dashed flex flex-col items-center justify-center p-8 text-center transition-colors min-h-[320px] ${
              previewUrl ? 'border-[#222a3a]' : 'border-[#283244] hover:border-emerald-500/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(',')}
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileProcess(e.target.files[0]);
                }
              }}
            />

            <div className="w-14 h-14 rounded-full bg-[#131722] border border-[#222a3a] flex items-center justify-center text-emerald-400 mb-4">
              <Upload className="w-6 h-6" />
            </div>

            <h4 className="text-sm font-semibold text-white mb-1">
              Select or drag image file here
            </h4>
            <p className="text-xs text-slate-400 max-w-xs mb-4">
              Supports JPEG, PNG, WebP up to {MAX_FILE_SIZE_MB}MB
            </p>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Browse Files
            </Button>
          </Card>

          {/* Inspection Preview Panel */}
          <Card className="flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <CardTitle>Browser Sandbox Preview</CardTitle>
              </div>
              {isSynthetic && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  SYNTHETIC FIXTURE
                </span>
              )}
            </CardHeader>

            <div className="flex-1 flex items-center justify-center bg-[#07090e] rounded-lg border border-[#171d27] p-4 min-h-[220px]">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Inspection target preview"
                  className="max-h-56 max-w-full object-contain rounded border border-[#1e2533]"
                />
              ) : (
                <div className="text-center text-slate-400 text-xs space-y-1">
                  <ImageIcon className="w-8 h-8 mx-auto opacity-30" />
                  <p>No image loaded yet</p>
                </div>
              )}
            </div>

            {/* Extracted Metadata Inspection */}
            {fileSha256 && (
              <div className="mt-4 pt-3 border-t border-[#171d27] space-y-1.5 text-[11px] font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>SHA-256 Digest:</span>
                  </span>
                  <span className="text-slate-200 truncate max-w-[220px]">{fileSha256}</span>
                </div>
                {imageDimensions && (
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Dimensions:</span>
                    <span className="text-slate-200">
                      {imageDimensions.width} × {imageDimensions.height} px
                    </span>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Case Details Inputs */}
        <Card className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Case Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Suspected Manipulated Executive Avatar"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0a0d13] border border-[#1e2534] focus:border-emerald-500 focus:outline-none text-white text-sm placeholder:text-slate-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Investigation Context & Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details regarding observed circulation context, platform origins, or suspected motive..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0a0d13] border border-[#1e2534] focus:border-emerald-500 focus:outline-none text-white text-sm placeholder:text-slate-400 transition-colors resize-none"
            />
          </div>
        </Card>

        {/* Error notification */}
        {error && (
          <div className="p-4 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Info className="w-4 h-4 text-slate-400" />
            <span>Submission registers a case with initial status: &apos;Analysis pending&apos;. Uploading does not imply guilt or proven tampering.</span>
          </div>

          <Button
            type="submit"
            isLoading={isSubmitting || isCalculatingHash}
            disabled={!previewUrl}
            icon={<FileCheck2 className="w-4 h-4" />}
          >
            Create Investigation Case
          </Button>
        </div>
      </form>
    </div>
  );
}
