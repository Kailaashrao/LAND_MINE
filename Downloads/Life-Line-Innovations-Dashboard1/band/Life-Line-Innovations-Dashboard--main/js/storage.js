/* =============================================
   Life Band – Data Storage & Mock Data Engine
   localStorage management + health data generation
   ============================================= */

const MockData = (() => {

  // ---- Public API for fetching data ----
  async function fetchLatestReadings() {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data; // formatted as { HeartRate: 75, SpO2: 98, ... }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      return null;
    }
  }

  // ---- Adapter to match old data structure ----
  async function getCurrentSnapshot() {
    const data = await fetchLatestReadings();
    if (!data) return null;

    // Map backend keys to frontend keys
    const snapshot = {
      stressLevel: data.Stress || 0,
      heartRate: data.HeartRate || 0,
      systolic: data.Systolic || 120,
      diastolic: data.Diastolic || 80,
      spo2: data.SpO2 || 0,
      temperature: data.Temperature || 98.6,
      status: 'normal', // derive status
      lastUpdated: data.Timestamp || new Date().toLocaleTimeString()
    };

    // Simple status derivation
    if (snapshot.stressLevel >= 80 || snapshot.systolic >= 145) snapshot.status = 'critical';
    else if (snapshot.stressLevel >= 60 || snapshot.systolic >= 130) snapshot.status = 'warning';

    return snapshot;
  }

  // ---- History is now fetched from backend (or simulated for now if only latest is available) ----
  // For this version, we will just simulate history based on current or keep it empty
  // Ideally, backend should provide history endpoint.
  // For now, let's keep a local buffer of history in memory for the charts
  let localHistory = [];

  async function loadReadings() {
    // In a real app, fetch /api/history.
    // Here we just return the local buffer which grows as we poll.
    return localHistory;
  }

  async function updateHistory(snapshot) {
     if (!snapshot) return;
     localHistory.push({
       ...snapshot,
       date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
       time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
     });
     if (localHistory.length > 50) localHistory.shift(); // keep last 50
  }

  // ---- Mock Doctors (Static data) ----
  const doctors = [
    { id: 1, name: 'Dr. Sarah Mitchell', specialty: 'Cardiologist', rating: 4.9, reviews: 312, location: 'Downtown Medical Center', distance: '1.2 mi', available: true, avatar: 'SM', experience: '15 years', phone: '+1 (555) 234-0011' },
    { id: 2, name: 'Dr. James Patel', specialty: 'Stress & Anxiety Specialist', rating: 4.8, reviews: 278, location: 'Wellness Clinic East', distance: '2.5 mi', available: true, avatar: 'JP', experience: '12 years', phone: '+1 (555) 234-0022' },
    { id: 3, name: 'Dr. Emily Chen', specialty: 'General Practitioner', rating: 4.7, reviews: 456, location: 'City Health Hub', distance: '0.8 mi', available: false, avatar: 'EC', experience: '10 years', phone: '+1 (555) 234-0033' },
    { id: 4, name: 'Dr. Robert Okafor', specialty: 'Neurologist', rating: 4.9, reviews: 189, location: 'NeuroHealth Institute', distance: '3.1 mi', available: true, avatar: 'RO', experience: '20 years', phone: '+1 (555) 234-0044' },
    { id: 5, name: 'Dr. Priya Sharma', specialty: 'Psychologist', rating: 4.6, reviews: 341, location: 'MindWell Therapy', distance: '1.7 mi', available: true, avatar: 'PS', experience: '8 years', phone: '+1 (555) 234-0055' },
    { id: 6, name: 'Dr. Michael Torres', specialty: 'Internal Medicine', rating: 4.8, reviews: 267, location: 'Metro Hospital', distance: '4.0 mi', available: true, avatar: 'MT', experience: '18 years', phone: '+1 (555) 234-0066' }
  ];

  // ---- Suggestions Engine ----
  function generateSuggestions(snapshot = {}) {
    const base = [
      { id: 1, title: 'Practice Deep Breathing', description: 'Try 4-7-8 breathing technique for 5 minutes.', category: 'Mindfulness', priority: 'high', icon: 'wind' },
      { id: 2, title: 'Take a 15-Minute Walk', description: 'Light physical activity can reduce cortisol levels.', category: 'Exercise', priority: 'medium', icon: 'footprints' },
      { id: 3, title: 'Hydrate Regularly', description: 'Aim for 8 glasses of water daily.', category: 'Nutrition', priority: 'medium', icon: 'droplets' }
    ];
    if (snapshot && snapshot.stressLevel >= 70) {
      base.unshift({ id: 7, title: 'Immediate Stress Intervention', description: 'Your stress level is critically high.', category: 'Urgent', priority: 'critical', icon: 'alert-triangle' });
    }
    return base;
  }
  
  // ---- Helper to average (for charts) ----
  function getDailyAverages(readings) {
     // For this simple version, just return the raw readings as "daily averages"
     // so the charts have something to plot. 
     // A real implementation would group by date.
     return readings.map(r => ({
       date: r.time, // use time as x-axis for real-time
       stress: r.stressLevel,
       heartRate: r.heartRate,
       systolic: r.systolic,
       diastolic: r.diastolic,
       spo2: r.spo2,
       temperature: r.temperature
     }));
  }

  // ---- Public API ----
  return {
    getCurrentSnapshot,
    localHistory,
    updateHistory,
    loadReadings,
    generateSuggestions,
    getDailyAverages,
    doctors,
    // Keep some helpers if other code relies on them, or just let them break if unused
    formatDate: (d) => new Date(d).toLocaleDateString(),
    formatTime: (d) => new Date(d).toLocaleTimeString()
  };

})();
