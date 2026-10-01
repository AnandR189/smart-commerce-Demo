import { Shield, Truck, RotateCcw, Star, TrendingUp, CheckCircle } from 'lucide-react';
import { getConfidenceData, getStarRating } from '../utils/confidenceEngine';

export default function ConfidencePanel({ product }) {
  const data = getConfidenceData(product);
  if (!data) return null;

  const { overallScore, scoreLabel, scoreColor, valueScore, sentimentScore, deliveryConfidence, returnFriendly, reviewSummary, delivery, returnPolicy, productMatch, rating, reviews } = data;

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 20,
        padding: 24,
        marginTop: 32,
      }}
    >
      {/* Header with Score */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Shield size={18} color={scoreColor} />
            <h3 style={{ fontSize: 17, fontWeight: 700, fontFamily: 'Outfit', color: 'var(--color-text-primary)' }}>
              Purchase Confidence
            </h3>
          </div>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            Based on {reviews.toLocaleString()} verified reviews
          </p>
        </div>

        {/* Big score */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 72, height: 72, borderRadius: '50%',
              border: `3px solid ${scoreColor}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: `${scoreColor}12`,
              boxShadow: `0 0 20px ${scoreColor}30`,
            }}
          >
            <span style={{ fontSize: 22, fontWeight: 900, fontFamily: 'Outfit', color: scoreColor, lineHeight: 1 }}>
              {overallScore}
            </span>
            <span style={{ fontSize: 9, color: scoreColor, fontWeight: 600, letterSpacing: '0.3px' }}>/ 100</span>
          </div>
          <p style={{ fontSize: 11, fontWeight: 700, color: scoreColor, marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {scoreLabel}
          </p>
        </div>
      </div>

      {/* Score bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        <ScoreBar label="Value Score" value={valueScore} color="#6366f1" icon={<TrendingUp size={13} />} />
        <ScoreBar label="Review Sentiment" value={sentimentScore} color="#10b981" icon={<Star size={13} />} />
        <ScoreBar label="Delivery Confidence" value={deliveryConfidence} color="#f59e0b" icon={<Truck size={13} />} />
      </div>

      {/* Divider */}
      <div className="divider" style={{ margin: '16px 0' }} />

      {/* Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Star rating */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, background: 'rgba(245,158,11,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star size={16} color="#f59e0b" fill="#f59e0b" />
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)' }}>Review Sentiment</p>
              <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={11} fill={i <= Math.round(rating) ? '#f59e0b' : 'none'} color={i <= Math.round(rating) ? '#f59e0b' : 'var(--color-text-muted)'} />
                ))}
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginLeft: 4 }}>{rating}/5</span>
              </div>
            </div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b', background: 'rgba(245,158,11,0.08)', padding: '3px 10px', borderRadius: 100, border: '1px solid rgba(245,158,11,0.2)' }}>
            {reviewSummary}
          </span>
        </div>

        {/* Delivery */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, background: 'rgba(16,185,129,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Truck size={16} color="#10b981" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)' }}>Estimated Delivery</p>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Arrives in {delivery}</p>
          </div>
          <CheckCircle size={16} color="#10b981" />
        </div>

        {/* Returns */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, background: 'rgba(99,102,241,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <RotateCcw size={16} color="#818cf8" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)' }}>Return Policy</p>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{returnPolicy}</p>
          </div>
          {returnFriendly && (
            <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(99,102,241,0.1)', color: '#818cf8', padding: '3px 8px', borderRadius: 100, border: '1px solid rgba(99,102,241,0.2)' }}>
              Hassle-free
            </span>
          )}
        </div>
      </div>

      {/* Why this product */}
      <div style={{ marginTop: 16, padding: '14px 16px', background: 'rgba(10,10,15,0.5)', borderRadius: 12, border: '1px solid var(--color-border)' }}>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--color-text-muted)', marginBottom: 6 }}>
          Why shoppers choose this
        </p>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>
          "{productMatch}"
        </p>
      </div>
    </div>
  );
}

function ScoreBar({ label, value, color, icon }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)' }}>
          {icon}
          <span style={{ fontSize: 12 }}>{label}</span>
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{value}%</span>
      </div>
      <div style={{ height: 6, background: 'var(--color-surface-2)', borderRadius: 100, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color}80, ${color})`,
            borderRadius: 100,
            transition: 'width 1s ease',
          }}
        />
      </div>
    </div>
  );
}
