const express = require('express');
const router = express.Router();

// GET news & public intelligence feed
router.get('/news', (req, res) => {
  const { news } = req.app.locals;
  res.json({
    success: true,
    isLive: false,
    demoMode: true,
    data: news
  });
});

// GET static challenges & case studies
router.get('/challenges', (req, res) => {
  const challenges = [
    {
      id: 'chal-1',
      title: 'Supply Chain Disruption',
      summary: 'Global instability and tier-2/3 supplier dependencies create critical production bottlenecks.',
      impact: 'HIGH',
      keyFactor: 'Component lead times'
    },
    {
      id: 'chal-2',
      title: 'Material Availability',
      summary: 'Critical aerospace raw materials like specialized titanium alloys and carbon precursor matrix face volatile sourcing.',
      impact: 'HIGH',
      keyFactor: 'Raw material reserves'
    },
    {
      id: 'chal-3',
      title: 'Manufacturing Capacity',
      summary: 'Large aerospace defense programs experience long production cycles and limited specialized tooling capacity.',
      impact: 'MEDIUM',
      keyFactor: 'Tooling utilization'
    },
    {
      id: 'chal-4',
      title: 'Skilled Maintenance Workforce',
      summary: 'Specialized aerospace depot technicians and field repair personnel present operational throughput bottlenecks.',
      impact: 'HIGH',
      keyFactor: 'Workforce availability'
    },
    {
      id: 'chal-5',
      title: 'Fragmented Siloed Data',
      summary: 'Maintenance, inventory stock, and upstream vendor data exist in disconnected legacy enterprise databases.',
      impact: 'CRITICAL',
      keyFactor: 'Data integration'
    },
    {
      id: 'chal-6',
      title: 'Extended Procurement Lead Times',
      summary: 'Specialized radar logic and turbofan components require long lead times for qualification and delivery.',
      impact: 'MEDIUM',
      keyFactor: 'Procurement cycle'
    }
  ];

  const caseStudy = {
    title: 'Case Study: Ukraine Support & Defense Supply Resilience',
    fundingPackage: '€90 Billion EU Package (2026–2027)',
    breakdown: [
      { label: 'Budgetary Support', amount: '€30 Billion' },
      { label: 'Defense-Related Support', amount: '€60 Billion' }
    ],
    source: 'European Union / European Commission (Official Public Release)',
    lessonLearned: 'Large-scale defense procurement highlights why industrial production capacity, supplier network resilience, procurement speed, and depot logistics directly determine operational readiness.'
  };

  res.json({
    success: true,
    challenges,
    caseStudy
  });
});

module.exports = router;
