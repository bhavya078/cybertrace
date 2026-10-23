import { Case, ForensicAnalysisResult, ForensicIndicator } from '@/types';
import { IForensicService, ForensicScanOptions } from './forensic-service.interface';
import { generateId } from '@/lib/utils';

export class MockForensicService implements IForensicService {
  async analyze(caseRecord: Case, options?: ForensicScanOptions): Promise<ForensicAnalysisResult> {
    const fileName = caseRecord.imageMetadata.fileName.toLowerCase();
    const scenario = options?.simulatedScenario;

    // Determine deterministic behavior based on fixture markers or scenario
    const isDoc = scenario === 'manipulated_doc' || fileName.includes('audit') || fileName.includes('doc');
    const isAuthentic = scenario === 'authentic' || fileName.includes('authentic') || fileName.includes('original');
    const isDeepfake = scenario === 'deepfake' || fileName.includes('synthetic') || fileName.includes('deepfake');

    let overallVerdict: ForensicAnalysisResult['overallVerdict'] = 'manipulation_suspected';
    let confidenceScore = 0.84;
    let explanation = '';
    const indicators: ForensicIndicator[] = [];

    if (isAuthentic) {
      overallVerdict = 'authentic_candidate';
      confidenceScore = 0.93;
      explanation =
        'Continuous sensor noise pattern across all RGB channels. No high-frequency generator artifacts or compression grid anomalies detected. EXIF quantization tables conform to standard digital camera specs.';
      indicators.push(
        {
          id: generateId('ind'),
          name: 'Homogeneous Sensor Noise Distribution',
          type: 'compression_grid',
          severity: 'low',
          score: 0.12,
          description:
            'PRNU (Photo Response Non-Uniformity) analysis indicates consistent camera sensor silicon noise across the frame.',
        },
        {
          id: generateId('ind'),
          name: 'Header & Metadata Integrity',
          type: 'metadata_consistency',
          severity: 'low',
          score: 0.08,
          description:
            'Camera manufacturer tags, color profile, and exposure parameters correlate with visual shadow and lighting angles.',
        }
      );
    } else if (isDoc) {
      overallVerdict = 'manipulation_suspected';
      confidenceScore = 0.89;
      explanation =
        'Localized Error Level Analysis (ELA) reveals significant compression discrepancy in central alphanumeric regions. Resaving artifacts indicate text replacement spliced onto background parchment.';
      indicators.push(
        {
          id: generateId('ind'),
          name: 'Error Level Analysis (ELA) Variance',
          type: 'error_level_analysis',
          severity: 'high',
          score: 0.94,
          description:
            'High brightness differential in localized 8x8 DCT blocks around transaction numbers, indicating disparate resaving cycles.',
        },
        {
          id: generateId('ind'),
          name: 'Copy-Move Feature Duplication',
          type: 'clone_detection',
          severity: 'high',
          score: 0.86,
          description:
            'SIFT keypoint clustering detected identical background noise patches cloned over original timestamp area.',
        },
        {
          id: generateId('ind'),
          name: 'JPEG Quantization Mismatch',
          type: 'compression_grid',
          severity: 'medium',
          score: 0.77,
          description:
            'Luminance and chrominance quantization tables differ from expected single-generation camera/scanner exports.',
        }
      );
    } else if (isDeepfake) {
      overallVerdict = 'manipulation_suspected';
      confidenceScore = 0.91;
      explanation =
        'High-order frequency decomposition identified convolutional generator upsampling artifacts. Facial boundary gradient variance is consistent with synthetic diffusion or GAN face-swapping pipelines.';
      indicators.push(
        {
          id: generateId('ind'),
          name: 'Neural Upconvolution Grid Residuals',
          type: 'gan_artifact',
          severity: 'high',
          score: 0.92,
          description:
            'Periodic checkerboard pattern identified in 2D Fourier transform spectra, characteristic of generative deconvolutional layers.',
        },
        {
          id: generateId('ind'),
          name: 'Facial Boundary Blending Gradient',
          type: 'face_boundary',
          severity: 'high',
          score: 0.88,
          description:
            'Micro-blurring discontinuity along jawline and hair perimeter indicates soft mask compositing over source frame.',
        },
        {
          id: generateId('ind'),
          name: 'Pupil Geometry & Specular Lighting Mismatch',
          type: 'gan_artifact',
          severity: 'medium',
          score: 0.74,
          description:
            'Corneal reflections in left and right eyes do not align to a coherent 3D environmental light source vector.',
        }
      );
    } else {
      // General uploaded image default demo analysis
      overallVerdict = 'inconclusive';
      confidenceScore = 0.65;
      explanation =
        'Preliminary heuristic inspection completed. Image exhibits standard web recompression. Further multi-model inspection via dedicated NVIDIA vision checkpoints recommended for definitive adjudication.';
      indicators.push(
        {
          id: generateId('ind'),
          name: 'Preliminary Compression Analysis',
          type: 'error_level_analysis',
          severity: 'medium',
          score: 0.58,
          description:
            'Uniform baseline compression detected with minor edge quantization artifacts typical of standard web encoders.',
        },
        {
          id: generateId('ind'),
          name: 'Metadata Inspection',
          type: 'metadata_consistency',
          severity: 'low',
          score: 0.42,
          description:
            'Basic structural headers intact. No explicit editing software signatures detected in standard EXIF tags.',
        }
      );
    }

    return {
      id: generateId('ana'),
      caseId: caseRecord.id,
      analyzedAt: new Date().toISOString(),
      overallVerdict,
      confidenceScore,
      indicators,
      explanation,
      limitations: [
        'Demo analysis: Generated via deterministic mock forensic heuristics.',
        'Production integration requires connecting verified NVIDIA models via Nebius Token Factory.',
        'Forensic indicators provide probabilistic signals and should be verified by a qualified analyst prior to legal action.',
      ],
      modelInfo: {
        provider: 'CyberTrace Mock Heuristic Engine (NVIDIA Architecture Ready)',
        modelName: 'mock-forensics-analyzer-v1',
        version: '1.0.0-mock',
        isMock: true,
      },
    };
  }
}
