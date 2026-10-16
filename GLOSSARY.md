# Glossary

## Current Emotion

How the viewer feels right now. Fixed set for v1: Happy, Sad, Stressed, Angry, Bored, Lonely, Excited, Tired/Relaxed. Used for context and explanation, not for matching.

## Desired Emotion

How the viewer wants to feel after watching. Same fixed set as Current Emotion. May equal Current Emotion (comfort watch to stay) or differ (shift mood). Matching is done on this.

## Genre

Standard movie category. V1 single optional selection + Any: Action, Comedy, Drama, Horror, Romance, Sci-Fi, Thriller, Documentary, Animation.

## Catalogue Entry

One movie in the curated local catalogue (~50-100 for v1). Holds title, year, genre(s), synopsis (display-only), rating 0-10, poster-url, and feel-tags listing which Desired Emotions it serves.

## Recommendation

Top-5 Catalogue Entries filtered by Desired Emotion tags + Genre + min-rating (default 7.0), ranked highest-rating first, each with a 1-line why-match explanation linking Current → Desired.
