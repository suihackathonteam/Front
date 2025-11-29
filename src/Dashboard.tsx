import { useState, useEffect, useMemo } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './Dashboard.css'
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit'
import SuiConnectButton from './SuiConnectButton'
import { useIdentityEvents } from './hooks/useIdentity'

function Dashboard() {
  const [selectedView, setSelectedView] = useState('overview')
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)
  const currentAccount = useCurrentAccount()
  const client = useSuiClient()

  const { events: allEvents, loading: eventsLoading } = useIdentityEvents()
  
  const [workerCards, setWorkerCards] = useState<any[]>([])
  const [loadingCards, setLoadingCards] = useState(true)

  const parsedEvents = useMemo(() => {
    const doorEvents: any[] = []
    const machineEvents: any[] = []
    const clockEvents: any[] = []
    const awardEvents: any[] = []

    allEvents.forEach((event) => {
      try {
        const eventType = event.type.split('::').pop()
        const parsedJson = event.parsedJson

        if (eventType === 'DoorAccessEvent') {
          doorEvents.push({
            worker_address: parsedJson.worker_address,
            card_number: parsedJson.card_number,
            door_id: Number(parsedJson.door_id),
            door_name: parsedJson.door_name,
            access_type: Number(parsedJson.access_type),
            timestamp: new Date(Number(parsedJson.timestamp_ms)),
            is_entry: Number(parsedJson.access_type) === 2, // 2 = entry, 3 = exit
          })
        } else if (eventType === 'MachineUsageEvent') {
          machineEvents.push({
            worker_address: parsedJson.worker_address,
            card_number: parsedJson.card_number,
            machine_id: Number(parsedJson.machine_id),
            machine_name: parsedJson.machine_name,
            timestamp: new Date(Number(parsedJson.timestamp_ms)),
            duration: Number(parsedJson.usage_duration_ms),
            production_count: Number(parsedJson.production_count),
            efficiency: Number(parsedJson.efficiency_percentage),
          })
        } else if (eventType === 'ClockEvent') {
          clockEvents.push({
            worker_address: parsedJson.worker_address,
            card_number: parsedJson.card_number,
            timestamp: new Date(Number(parsedJson.timestamp_ms)),
            action_type: Number(parsedJson.action_type),
          })
        } else if (eventType === 'AwardEvent') {
          awardEvents.push({
            worker_address: parsedJson.worker_address,
            card_number: parsedJson.card_number,
            award_type: parsedJson.award_type,
            points: Number(parsedJson.points),
            description: parsedJson.description,
            timestamp: new Date(Number(parsedJson.timestamp_ms)),
          })
        }
      } catch (err) {
        console.warn('Event parse error:', err, event)
      }
    })

    return { doorEvents, machineEvents, clockEvents, awardEvents }
  }, [allEvents])

  // Fetch worker cards from blockchain
  useEffect(() => {
    const fetchWorkerCards = async () => {
      if (!currentAccount) {
        setLoadingCards(false)
        return
      }

      try {
        setLoadingCards(true)
        
        // For now, build worker cards from events
        // This is a fallback approach since WorkerCards are not stored in registry
        const uniqueWorkers = new Map<string, any>()

        // Process all events to build worker profiles
        allEvents.forEach((event) => {
          try {
            const parsedJson = event.parsedJson
            const address = parsedJson.worker_address
            
            if (!address) return

            if (!uniqueWorkers.has(address)) {
              // Decode card_number and create initial profile
              let cardNumber = 'N/A'
              try {
                if (parsedJson.card_number) {
                  if (typeof parsedJson.card_number === 'string') {
                    cardNumber = parsedJson.card_number
                  } else if (Array.isArray(parsedJson.card_number)) {
                    cardNumber = new TextDecoder().decode(new Uint8Array(parsedJson.card_number))
                  }
                }
              } catch (e) {
                console.warn('Card number decode error:', e)
              }

              uniqueWorkers.set(address, {
                id: address,
                worker_address: address,
                card_number: cardNumber,
                name: cardNumber,
                department: 'General',
                is_active: true,
                total_work_hours: 0,
                total_production: 0,
                efficiency_score: 0,
                event_count: 0,
              })
            }

            const worker = uniqueWorkers.get(address)
            worker.event_count++

            // Update stats based on event type
            const eventType = event.type.split('::').pop()
            if (eventType === 'MachineUsageEvent') {
              worker.total_work_hours += Number(parsedJson.usage_duration_ms || 0)
              worker.total_production += Number(parsedJson.production_count || 0)
              const efficiency = Number(parsedJson.efficiency_percentage || 0)
              // Calculate weighted average efficiency
              if (worker.efficiency_score === 0) {
                worker.efficiency_score = efficiency
              } else {
                worker.efficiency_score = Math.round((worker.efficiency_score * 0.7 + efficiency * 0.3))
              }
            }
          } catch (err) {
            console.warn('Worker profile build error:', err)
          }
        })

        const cards = Array.from(uniqueWorkers.values())
        setWorkerCards(cards)
      } catch (err) {
        console.error('Worker cards fetch error:', err)
      } finally {
        setLoadingCards(false)
      }
    }

    fetchWorkerCards()
  }, [currentAccount, client, allEvents])

  const doorAccessData = useMemo(() => {
    const hourlyData: { [key: string]: { entries: number; exits: number } } = {}

    parsedEvents.doorEvents.forEach((event) => {
      const hour = event.timestamp.getHours()
      const timeKey = `${hour.toString().padStart(2, '0')}:00`

      if (!hourlyData[timeKey]) {
        hourlyData[timeKey] = { entries: 0, exits: 0 }
      }

      if (event.is_entry) {
        hourlyData[timeKey].entries++
      } else {
        hourlyData[timeKey].exits++
      }
    })

    return Object.entries(hourlyData)
      .map(([time, data]) => ({ time, ...data }))
      .sort((a, b) => a.time.localeCompare(b.time))
  }, [parsedEvents.doorEvents])

  const machineUsageData = useMemo(() => {
    const machineStats: { [key: string]: { name: string; totalDuration: number; totalProduction: number; count: number; totalEfficiency: number } } = {}

    parsedEvents.machineEvents.forEach((event) => {
      const machineId = String(event.machine_id)
      
      // Decode machine name
      let machineName = `Machine ${machineId}`
      try {
        if (event.machine_name) {
          if (typeof event.machine_name === 'string') {
            machineName = event.machine_name
          } else if (Array.isArray(event.machine_name)) {
            machineName = new TextDecoder().decode(new Uint8Array(event.machine_name))
          }
        }
      } catch (e) {
        console.warn('Machine name decode error:', e)
      }

      if (!machineStats[machineId]) {
        machineStats[machineId] = { name: machineName, totalDuration: 0, totalProduction: 0, count: 0, totalEfficiency: 0 }
      }

      machineStats[machineId].totalDuration += event.duration || 0
      machineStats[machineId].totalProduction += event.production_count || 0
      machineStats[machineId].totalEfficiency += event.efficiency || 0
      machineStats[machineId].count++
    })

    return Object.entries(machineStats).map(([_machineId, stats]) => ({
      machine: stats.name,
      usage: (stats.totalDuration / (1000 * 3600)).toFixed(1), // Convert ms to hours
      production: stats.totalProduction,
      efficiency: stats.count > 0 ? Math.round(stats.totalEfficiency / stats.count) : 0,
    }))
  }, [parsedEvents.machineEvents])

  const employeeProductivity = useMemo(() => {
    return workerCards.map((card) => ({
      name: card.name,
      machine: card.department,
      duration: (card.total_work_hours / (1000 * 3600)).toFixed(1), // Convert ms to hours
      production: card.total_production,
      efficiency: card.efficiency_score,
    }))
  }, [workerCards])

  const employeeAwards = useMemo(() => {
    return parsedEvents.awardEvents.slice(0, 4).map((award, index) => {
      const workerCard = workerCards.find((card) => card.worker_address === award.worker_address)
      
      // Decode award type
      let awardTypeText = 'Award'
      try {
        if (award.award_type) {
          if (typeof award.award_type === 'string') {
            awardTypeText = award.award_type
          } else if (Array.isArray(award.award_type)) {
            awardTypeText = new TextDecoder().decode(new Uint8Array(award.award_type))
          }
        }
      } catch (e) {
        console.warn('Award type decode error:', e)
      }

      // Decode description
      let descriptionText = ''
      try {
        if (award.description) {
          if (typeof award.description === 'string') {
            descriptionText = award.description
          } else if (Array.isArray(award.description)) {
            descriptionText = new TextDecoder().decode(new Uint8Array(award.description))
          }
        }
      } catch (e) {
        console.warn('Description decode error:', e)
      }

      return {
        id: index + 1,
        employee: workerCard?.name || award.worker_address.slice(0, 8) + '...',
        award: `🏆 ${awardTypeText}`,
        date: award.timestamp.toLocaleDateString('tr-TR'),
        description: descriptionText || `${award.points} points award`,
        points: award.points,
      }
    })
  }, [parsedEvents.awardEvents, workerCards])

  const realtimeStats = useMemo(() => {
    const activeWorkers = workerCards.filter((card) => card.is_active).length
    const totalProduction = workerCards.reduce((sum, card) => sum + card.total_production, 0)

    // Count today's door entries
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayEntries = parsedEvents.doorEvents.filter(e => e.timestamp >= today && e.is_entry).length

    return [
      { icon: '👥', title: 'Active Workers', value: String(activeWorkers), change: `Total: ${workerCards.length}`, color: '#667eea' },
      { icon: '⚙️', title: 'Active Machines', value: `${machineUsageData.length}`, change: `${parsedEvents.machineEvents.length} uses`, color: '#764ba2' },
      { icon: '📦', title: 'Total Production', value: String(totalProduction), change: `${parsedEvents.machineEvents.length} operations`, color: '#f093fb' },
      { icon: '🚪', title: 'Today Entries', value: `${todayEntries}`, change: `${parsedEvents.doorEvents.length} total`, color: '#4facfe' },
    ]
  }, [workerCards, machineUsageData, parsedEvents])

	  if(!currentAccount){
		return (
			<div className="home-container">
				<div className="cta-section">
					<p className="cta-text">Connect your Sui wallet to access the system</p>
					<div className="cta-button">
						<SuiConnectButton />
					</div>
				</div>
			</div>
		)
	}

  if (eventsLoading || loadingCards) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-main">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', flexDirection: 'column', gap: '20px' }}>
            <div className="spinner" style={{ width: '50px', height: '50px', border: '4px solid #667eea', borderTop: '4px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ color: '#b8b8b8' }}>Loading dashboard data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>System Tracking Panel</h1>
              <p>Personnel entry-exit and activity tracking</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className={selectedView === 'overview' ? 'nav-active' : ''} onClick={() => setSelectedView('overview')}>📊 Overview</button>
              <button className={selectedView === 'doors' ? 'nav-active' : ''} onClick={() => setSelectedView('doors')}>🚪 Doors</button>
              <button className={selectedView === 'machines' ? 'nav-active' : ''} onClick={() => setSelectedView('machines')}>⚙️ Machines</button>
              <button className={selectedView === 'employees' ? 'nav-active' : ''} onClick={() => setSelectedView('employees')}>👥 Employees</button>
              <button className={selectedView === 'awards' ? 'nav-active' : ''} onClick={() => setSelectedView('awards')}>🏆 Awards</button>
            </div>
          </div>

          {/* Real-time Stats */}
          <div className="stats-grid">
            {realtimeStats.map((stat, index) => (
              <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-info">
                  <p className="stat-title">{stat.title}</p>
                  <h3 className="stat-value">{stat.value}</h3>
                  <span className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                    {stat.change} today
                  </span>
                </div>
              </div>
            ))}
          </div>

          {selectedView === 'overview' && (
            <>
              {allEvents.length === 0 ? (
                <div className="chart-card full-width" style={{ textAlign: 'center', padding: '40px' }}>
                  <h3>📊 No Data Yet</h3>
                  <p style={{ color: '#b8b8b8', marginTop: '16px' }}>
                    Real-time data will appear here when the system is in use.
                  </p>
                  <p style={{ color: '#b8b8b8', marginTop: '8px' }}>
                    Create worker cards from the admin panel, add door and machine records.
                  </p>
                </div>
              ) : (
                <>
              {/* Charts Section */}
              <div className="charts-section">
                <div className="chart-card">
                  <h3>Hourly Door Access Analysis</h3>
                  {doorAccessData.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#b8b8b8' }}>
                      <p>No door access records yet</p>
                    </div>
                  ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={doorAccessData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
                      <XAxis dataKey="time" stroke="#b8b8b8" />
                      <YAxis stroke="#b8b8b8" />
                      <Tooltip 
                        contentStyle={{ background: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: '8px' }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="entries" stroke="#667eea" strokeWidth={2} name="Entry" />
                      <Line type="monotone" dataKey="exits" stroke="#764ba2" strokeWidth={2} name="Exit" />
                    </LineChart>
                  </ResponsiveContainer>
                  )}
                </div>

                <div className="chart-card">
                  <h3>Machine Usage Efficiency</h3>
                  {machineUsageData.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#b8b8b8' }}>
                      <p>No machine usage records yet</p>
                    </div>
                  ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={machineUsageData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
                      <XAxis dataKey="machine" stroke="#b8b8b8" />
                      <YAxis stroke="#b8b8b8" />
                      <Tooltip 
                        contentStyle={{ background: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: '8px' }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Legend />
                      <Bar dataKey="efficiency" fill="#667eea" name="Efficiency %" />
                    </BarChart>
                  </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="chart-card full-width">
                <h3>Employee Production Performance</h3>
                {employeeProductivity.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px', color: '#b8b8b8' }}>
                    <p>No employee performance data yet</p>
                  </div>
                ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={employeeProductivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
                    <XAxis dataKey="name" stroke="#b8b8b8" />
                    <YAxis stroke="#b8b8b8" />
                    <Tooltip 
                      contentStyle={{ background: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Bar dataKey="production" fill="#667eea" name="Produced Items" />
                    <Bar dataKey="efficiency" fill="#764ba2" name="Efficiency %" />
                  </BarChart>
                </ResponsiveContainer>
                )}
              </div>
              </>
              )}
            </>
          )}

          {selectedView === 'doors' && (
            <div className="doors-section">
              <div className="section-header">
                <h2>Door Access Tracking</h2>
                <button className="add-btn">+ New Record</button>
              </div>
              
              <div className="chart-card">
                <h3>Today's Access Movements</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={doorAccessData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
                    <XAxis dataKey="time" stroke="#b8b8b8" />
                    <YAxis stroke="#b8b8b8" />
                    <Tooltip 
                      contentStyle={{ background: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="entries" stroke="#43e97b" strokeWidth={2} name="Entry" />
                    <Line type="monotone" dataKey="exits" stroke="#ff6b6b" strokeWidth={2} name="Exit" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="door-table">
                <h3>Recent Door Access</h3>
                {parsedEvents.doorEvents.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#b8b8b8' }}>
                    <p>No door access records yet</p>
                  </div>
                ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Door</th>
                      <th>Time</th>
                      <th>Type</th>
                      <th>Card No</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedEvents.doorEvents.slice(0, 10).map((event, index) => {
                      const worker = workerCards.find(w => w.worker_address === event.worker_address)
                      
                      // Decode door name
                      let doorName = `Door ${event.door_id}`
                      try {
                        if (event.door_name) {
                          if (typeof event.door_name === 'string') {
                            doorName = event.door_name
                          } else if (Array.isArray(event.door_name)) {
                            doorName = new TextDecoder().decode(new Uint8Array(event.door_name))
                          }
                        }
                      } catch (e) {
                        console.warn('Door name decode error:', e)
                      }

                      // Decode card number
                      let cardNumber = 'N/A'
                      try {
                        if (event.card_number) {
                          if (typeof event.card_number === 'string') {
                            cardNumber = event.card_number
                          } else if (Array.isArray(event.card_number)) {
                            cardNumber = new TextDecoder().decode(new Uint8Array(event.card_number))
                          }
                        }
                      } catch (e) {
                        console.warn('Card number decode error:', e)
                      }

                      return (
                        <tr key={index}>
                          <td>{worker?.name || event.worker_address.slice(0, 8) + '...'}</td>
                          <td>{doorName}</td>
                          <td>{event.timestamp.toLocaleTimeString('tr-TR')}</td>
                          <td>
                            <span className={`badge ${event.is_entry ? 'giris' : 'cikis'}`}>
                              {event.is_entry ? 'Entry' : 'Exit'}
                            </span>
                          </td>
                          <td>{cardNumber}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                )}
              </div>
            </div>
          )}

          {selectedView === 'machines' && (
            <div className="machines-section">
              <div className="section-header">
                <h2>Machine/Resource Usage Tracking</h2>
                <button className="add-btn">+ New Machine/Resource</button>
              </div>

              <div className="machine-stats-grid">
                {machineUsageData.map((machine, index) => (
                  <div key={index} className="machine-card">
                    <div className="machine-header">
                      <h3>{machine.machine}</h3>
                      <span className={`machine-status ${parseFloat(machine.usage) > 7 ? 'active' : 'idle'}`}>
                        {parseFloat(machine.usage) > 7 ? '● Active' : '○ Idle'}
                      </span>
                    </div>
                    <div className="machine-stats">
                      <div className="stat">
                        <span className="label">Usage Time</span>
                        <span className="value">{machine.usage}h</span>
                      </div>
                      <div className="stat">
                        <span className="label">Produced</span>
                        <span className="value">{machine.production} items</span>
                      </div>
                      <div className="stat">
                        <span className="label">Efficiency</span>
                        <span className="value">{machine.efficiency}%</span>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${machine.efficiency}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="chart-card full-width">
                <h3>Machine-Based Detailed Analysis</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={machineUsageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
                    <XAxis dataKey="machine" stroke="#b8b8b8" />
                    <YAxis stroke="#b8b8b8" />
                    <Tooltip 
                      contentStyle={{ background: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Bar dataKey="usage" fill="#667eea" name="Usage (hours)" />
                    <Bar dataKey="production" fill="#764ba2" name="Production (items)" />
                    <Bar dataKey="efficiency" fill="#f093fb" name="Efficiency %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {selectedView === 'employees' && (
            <div className="employees-section">
              <div className="section-header">
                <h2>Employee Detailed Tracking</h2>
                <button className="add-btn">+ New Employee</button>
              </div>
              
              <div className="employee-table">
                {workerCards.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#b8b8b8' }}>
                    <p>No worker data yet</p>
                  </div>
                ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Department</th>
                      <th>Card No</th>
                      <th>Work Hours</th>
                      <th>Production</th>
                      <th>Efficiency</th>
                      <th>Events</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workerCards.map((card, index) => {
                      // Find last clock event for this worker
                      const lastClock = parsedEvents.clockEvents
                        .filter(e => e.worker_address === card.worker_address)
                        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0]
                      
                      const isActive = lastClock && lastClock.action_type === 0 // 0 = clock in
                      
                      return (
                        <tr key={index} onClick={() => setSelectedEmployee(card.name)} style={{ cursor: 'pointer' }}>
                          <td><span className="employee-name">👤 {card.name}</span></td>
                          <td>{card.department}</td>
                          <td>{card.card_number}</td>
                          <td>{(card.total_work_hours / (1000 * 3600)).toFixed(1)}h</td>
                          <td>{card.total_production} items</td>
                          <td>
                            <span className={`verimlilik-badge ${card.efficiency_score >= 80 ? 'high' : card.efficiency_score >= 50 ? 'medium' : 'low'}`}>
                              {card.efficiency_score}%
                            </span>
                          </td>
                          <td>{card.event_count || 0}</td>
                          <td>
                            <span className={`status ${isActive ? 'active' : 'offline'}`}>
                              {isActive ? 'Active' : 'Offline'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                )}
              </div>

              {selectedEmployee && (
                <div className="employee-detail">
                  <h3>📊 {selectedEmployee} - Detailed Report</h3>
                  <div className="detail-grid">
                    <div className="detail-card">
                      <h4>Door Access</h4>
                      <ul>
                        {parsedEvents.doorEvents
                          .filter(e => {
                            const worker = workerCards.find(w => w.name === selectedEmployee)
                            return worker && e.worker_address === worker.worker_address
                          })
                          .slice(0, 10)
                          .map((event, i) => {
                            let doorName = `Door ${event.door_id}`
                            try {
                              if (event.door_name) {
                                if (typeof event.door_name === 'string') {
                                  doorName = event.door_name
                                } else if (Array.isArray(event.door_name)) {
                                  doorName = new TextDecoder().decode(new Uint8Array(event.door_name))
                                }
                              }
                            } catch (e) {
                              console.warn('Door name decode error:', e)
                            }
                            
                            return (
                              <li key={i}>
                                {doorName}: {event.timestamp.toLocaleTimeString('tr-TR')} - {event.is_entry ? 'Entry' : 'Exit'}
                              </li>
                            )
                          })}
                        {parsedEvents.doorEvents.filter(e => {
                          const worker = workerCards.find(w => w.name === selectedEmployee)
                          return worker && e.worker_address === worker.worker_address
                        }).length === 0 && <li>No door access records</li>}
                      </ul>
                    </div>
                    <div className="detail-card">
                      <h4>Machine Usage</h4>
                      <ul>
                        {parsedEvents.machineEvents
                          .filter(e => {
                            const worker = workerCards.find(w => w.name === selectedEmployee)
                            return worker && e.worker_address === worker.worker_address
                          })
                          .slice(0, 10)
                          .map((event, i) => {
                            let machineName = `Machine ${event.machine_id}`
                            try {
                              if (event.machine_name) {
                                if (typeof event.machine_name === 'string') {
                                  machineName = event.machine_name
                                } else if (Array.isArray(event.machine_name)) {
                                  machineName = new TextDecoder().decode(new Uint8Array(event.machine_name))
                                }
                              }
                            } catch (e) {
                              console.warn('Machine name decode error:', e)
                            }
                            
                            return (
                              <li key={i}>
                                {machineName}: {(event.duration / (1000 * 3600)).toFixed(1)}h - {event.production_count} items ({event.efficiency}%)
                              </li>
                            )
                          })}
                        {parsedEvents.machineEvents.filter(e => {
                          const worker = workerCards.find(w => w.name === selectedEmployee)
                          return worker && e.worker_address === worker.worker_address
                        }).length === 0 && <li>No machine usage records</li>}
                      </ul>
                    </div>
                    <div className="detail-card">
                      <h4>Clock Events</h4>
                      <ul>
                        {parsedEvents.clockEvents
                          .filter(e => {
                            const worker = workerCards.find(w => w.name === selectedEmployee)
                            return worker && e.worker_address === worker.worker_address
                          })
                          .slice(0, 10)
                          .map((event, i) => (
                            <li key={i}>
                              {event.action_type === 0 ? '🕐 Clock In' : '🏁 Clock Out'}: {event.timestamp.toLocaleString('tr-TR')}
                            </li>
                          ))}
                        {parsedEvents.clockEvents.filter(e => {
                          const worker = workerCards.find(w => w.name === selectedEmployee)
                          return worker && e.worker_address === worker.worker_address
                        }).length === 0 && <li>No clock events</li>}
                      </ul>
                    </div>
                  </div>
                  <button className="close-detail" onClick={() => setSelectedEmployee(null)}>Close</button>
                </div>
              )}
            </div>
          )}

          {selectedView === 'awards' && (
            <div className="awards-section">
              <div className="section-header">
                <h2>Awards and Achievements</h2>
              </div>

              {employeeAwards.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#b8b8b8' }}>
                  <p>No awards given yet</p>
                </div>
              ) : (
                <>
                  <div className="awards-grid">
                    {employeeAwards.map((award) => (
                      <div key={award.id} className="award-card">
                        <div className="award-badge">
                          <span className="award-icon">{award.award.split(' ')[0]}</span>
                          <span className="award-points">+{award.points} points</span>
                        </div>
                        <h3>{award.award.split(' ').slice(1).join(' ')}</h3>
                        <p className="award-employee">🎖️ {award.employee}</p>
                        <p className="award-description">{award.description}</p>
                        <p className="award-date">📅 {award.date}</p>
                      </div>
                    ))}
                  </div>

                  <div className="leaderboard">
                    <h3>🏆 Points Leaderboard</h3>
                    <div className="leaderboard-list">
                      {(() => {
                        // Calculate total points per worker
                        const workerPoints = new Map<string, { name: string; points: number }>()
                        
                        parsedEvents.awardEvents.forEach(award => {
                          const worker = workerCards.find(w => w.worker_address === award.worker_address)
                          const name = worker?.name || award.worker_address.slice(0, 8) + '...'
                          
                          if (!workerPoints.has(award.worker_address)) {
                            workerPoints.set(award.worker_address, { name, points: 0 })
                          }
                          workerPoints.get(award.worker_address)!.points += award.points
                        })
                        
                        // Sort by points descending
                        const sorted = Array.from(workerPoints.values())
                          .sort((a, b) => b.points - a.points)
                          .slice(0, 5)
                        
                        if (sorted.length === 0) {
                          return <p style={{ textAlign: 'center', color: '#b8b8b8', padding: '20px' }}>No leaderboard data yet</p>
                        }
                        
                        return sorted.map((worker, index) => (
                          <div 
                            key={index} 
                            className={`leaderboard-item ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}`}
                          >
                            <span className="rank">{index + 1}</span>
                            <span className="name">{worker.name}</span>
                            <span className="score">{worker.points} points</span>
                          </div>
                        ))
                      })()}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}


        </div>
      </main>
    </div>
  )
}

export default Dashboard