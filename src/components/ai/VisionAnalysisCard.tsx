'use client';

import React, { useState } from 'react';
import { VisionAnalysisResult, CameraAngle } from '@/types/vehicle';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Camera,
  Sun,
  Eye,
  Edit2,
  Save,
  Info,
} from 'lucide-react';

interface VisionAnalysisCardProps {
  analysis: VisionAnalysisResult;
  onUpdateAnalysis?: (updated: VisionAnalysisResult) => void;
  isEditable?: boolean;
}

export const VisionAnalysisCard: React.FC<VisionAnalysisCardProps> = ({
  analysis: initialAnalysis,
  onUpdateAnalysis,
  isEditable = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [analysis, setAnalysis] = useState<VisionAnalysisResult>(initialAnalysis);
  const [newFeature, setNewFeature] = useState('');
  const [newDamage, setNewDamage] = useState('');

  const handleSave = () => {
    setIsEditing(false);
    if (onUpdateAnalysis) {
      onUpdateAnalysis(analysis);
    }
  };

  const removeFeature = (index: number) => {
    const updated = {
      ...analysis,
      visible_exterior_features: analysis.visible_exterior_features.filter((_, i) => i !== index),
    };
    setAnalysis(updated);
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;
    const updated = {
      ...analysis,
      visible_exterior_features: [...analysis.visible_exterior_features, newFeature.trim()],
    };
    setAnalysis(updated);
    setNewFeature('');
  };

  const addDamage = () => {
    if (!newDamage.trim()) return;
    const updated = {
      ...analysis,
      visible_damage_or_imperfections: [...analysis.visible_damage_or_imperfections, newDamage.trim()],
      has_damage: true,
    };
    setAnalysis(updated);
    setNewDamage('');
  };

  const removeDamage = (index: number) => {
    const updatedList = analysis.visible_damage_or_imperfections.filter((_, i) => i !== index);
    const updated = {
      ...analysis,
      visible_damage_or_imperfections: updatedList,
      has_damage: updatedList.length > 0,
    };
    setAnalysis(updated);
  };

  return (
    <div className="rounded-md border border-charcoal-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-charcoal-100">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-charcoal-900 text-white">
            <Camera className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-charcoal-900">Gemini Vision Technical Analysis</h3>
              <span className="rounded bg-charcoal-100 px-2 py-0.5 text-[10px] font-mono text-charcoal-600 uppercase font-semibold">
                Computer Vision Verified
              </span>
            </div>
            <p className="text-xs text-charcoal-500">
              Visual telemetry extracted directly from photograph pixels
            </p>
          </div>
        </div>

        {isEditable && (
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-charcoal-300 hover:bg-charcoal-50 text-charcoal-700 transition-colors"
          >
            {isEditing ? (
              <>
                <Save className="h-3.5 w-3.5 text-emerald-600" />
                <span>Save Review</span>
              </>
            ) : (
              <>
                <Edit2 className="h-3.5 w-3.5 text-charcoal-500" />
                <span>Edit Extracted Data</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Primary Visual Matrix Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        {/* Category */}
        <div className="rounded border border-charcoal-100 bg-charcoal-50/50 p-3">
          <span className="text-[10px] uppercase font-mono text-charcoal-400 font-semibold block mb-1">
            Vehicle Category
          </span>
          {isEditing ? (
            <input
              type="text"
              value={analysis.vehicle_category}
              onChange={(e) => setAnalysis({ ...analysis, vehicle_category: e.target.value })}
              className="w-full text-xs font-semibold text-charcoal-900 bg-white border border-charcoal-200 rounded px-1.5 py-1"
            />
          ) : (
            <span className="text-xs font-semibold text-charcoal-900">{analysis.vehicle_category}</span>
          )}
        </div>

        {/* Color */}
        <div className="rounded border border-charcoal-100 bg-charcoal-50/50 p-3">
          <span className="text-[10px] uppercase font-mono text-charcoal-400 font-semibold block mb-1">
            Observed Paint Tone
          </span>
          {isEditing ? (
            <input
              type="text"
              value={analysis.approximate_color}
              onChange={(e) => setAnalysis({ ...analysis, approximate_color: e.target.value })}
              className="w-full text-xs font-semibold text-charcoal-900 bg-white border border-charcoal-200 rounded px-1.5 py-1"
            />
          ) : (
            <span className="text-xs font-semibold text-charcoal-900">{analysis.approximate_color}</span>
          )}
        </div>

        {/* Camera Angle */}
        <div className="rounded border border-charcoal-100 bg-charcoal-50/50 p-3">
          <span className="text-[10px] uppercase font-mono text-charcoal-400 font-semibold block mb-1">
            Framing & Angle
          </span>
          {isEditing ? (
            <select
              value={analysis.camera_angle}
              onChange={(e) => setAnalysis({ ...analysis, camera_angle: e.target.value as CameraAngle })}
              className="w-full text-xs font-semibold text-charcoal-900 bg-white border border-charcoal-200 rounded px-1 py-1"
            >
              <option value="front_three_quarter">Front 3/4</option>
              <option value="rear_three_quarter">Rear 3/4</option>
              <option value="side_profile">Side Profile</option>
              <option value="front_straight">Front Straight</option>
              <option value="rear_straight">Rear Straight</option>
              <option value="interior_cockpit">Interior Cockpit</option>
              <option value="wheel_rim">Wheel / Rim</option>
              <option value="engine_bay">Engine Bay</option>
              <option value="trunk_cargo">Trunk / Cargo</option>
            </select>
          ) : (
            <span className="text-xs font-semibold text-charcoal-900 capitalize">
              {analysis.camera_angle.replace(/_/g, ' ')}
            </span>
          )}
        </div>

        {/* Quality Score */}
        <div className="rounded border border-charcoal-100 bg-charcoal-50/50 p-3">
          <span className="text-[10px] uppercase font-mono text-charcoal-400 font-semibold block mb-1">
            Asset Clarity & Score
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-emerald-600 font-mono">
              {analysis.image_quality_score}/100
            </span>
            <span className="text-[10px] text-charcoal-500 capitalize">
              ({analysis.image_clarity})
            </span>
          </div>
        </div>
      </div>

      {/* Verified Visible Features */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-charcoal-800 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Visually Verified Exterior Features
          </span>
          <span className="text-[10px] text-charcoal-400">Strictly verifiable from image</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {analysis.visible_exterior_features.map((feat, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 rounded bg-charcoal-100 px-2.5 py-1 text-xs text-charcoal-800 border border-charcoal-200"
            >
              <span>{feat}</span>
              {isEditing && (
                <button
                  onClick={() => removeFeature(idx)}
                  className="text-charcoal-400 hover:text-red-500 font-bold ml-1"
                >
                  ×
                </button>
              )}
            </span>
          ))}
          {analysis.visible_exterior_features.length === 0 && (
            <span className="text-xs text-charcoal-400 italic">No specific packages visually discernible</span>
          )}
        </div>

        {isEditing && (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="Add verified visible feature (e.g., Matrix LED Headlights)..."
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              className="text-xs border border-charcoal-200 rounded px-2 py-1 flex-1"
            />
            <button
              onClick={addFeature}
              className="px-3 py-1 bg-charcoal-800 text-white text-xs rounded hover:bg-charcoal-700"
            >
              Add
            </button>
          </div>
        )}
      </div>

      {/* Visible Damage or Imperfections Section */}
      <div className="mt-5 rounded border border-charcoal-200 p-3 bg-charcoal-50/40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-charcoal-800 flex items-center gap-1.5">
            {analysis.has_damage ? (
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            ) : (
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            )}
            Condition & Defect Inspection (Truth-in-Advertising)
          </span>
          <span className="text-[10px] font-mono uppercase text-charcoal-500">
            {analysis.has_damage ? 'Notes Recorded' : 'Zero Visible Defects'}
          </span>
        </div>

        {analysis.visible_damage_or_imperfections.length > 0 ? (
          <ul className="space-y-1.5 mb-2">
            {analysis.visible_damage_or_imperfections.map((dmg, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded px-2.5 py-1"
              >
                <span>{dmg}</span>
                {isEditing && (
                  <button
                    onClick={() => removeDamage(idx)}
                    className="text-amber-600 hover:text-red-600 font-bold ml-2"
                  >
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-charcoal-600">
            No visible body panel defects, paint chips, scratches, or curb rash identified in this exposure.
          </p>
        )}

        {isEditing && (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="Record visible cosmetic defect (e.g., 2mm rock chip on hood)..."
              value={newDamage}
              onChange={(e) => setNewDamage(e.target.value)}
              className="text-xs border border-charcoal-200 rounded px-2 py-1 flex-1"
            />
            <button
              onClick={addDamage}
              className="px-3 py-1 bg-amber-700 text-white text-xs rounded hover:bg-amber-800"
            >
              Add Defect
            </button>
          </div>
        )}
      </div>

      {/* Composition Assessment & Recommendations */}
      {analysis.composition_assessment && (
        <div className="mt-4 pt-3 border-t border-charcoal-100 text-xs">
          <span className="font-semibold text-charcoal-800 block mb-1">Photographic Assessment:</span>
          <p className="text-charcoal-600 leading-relaxed mb-2">{analysis.composition_assessment}</p>

          {analysis.actionable_recommendations.length > 0 && (
            <div className="mt-2 space-y-1">
              <span className="text-[11px] font-semibold text-charcoal-700 uppercase font-mono">
                Merchandising Recommendations:
              </span>
              {analysis.actionable_recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs text-charcoal-600">
                  <span className="text-studio-accent font-bold">•</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

