import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faWallet, faMoneyBillTransfer, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import './Wallet.css';
import gsap from 'gsap';
import PageTransition from '../../components/PageTransition';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function Wallet() {
  const [balance, setBalance] = useState(1234.56);
  const [amount, setAmount] = useState('');
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showAddCrypto, setShowAddCrypto] = useState(false);
  const [transactionType, setTransactionType] = useState('deposit'); // 'deposit' or 'expense'
  const [transactionCategory, setTransactionCategory] = useState('');
  const [cryptoList, setCryptoList] = useState([
    { name: 'Bitcoin (BTC)', amount: '0.025' },
    { name: 'Ethereum (ETH)', amount: '0.5' }
  ]);
  const [newCrypto, setNewCrypto] = useState({ name: '', amount: '' });
  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [couponList, setCouponList] = useState([
    { name: '20% Off Shopping', code: 'SHOP20', validTill: '31/12/2024' },
    { name: '$10 Cashback', code: 'CASH10', validTill: '15/05/2024' }
  ]);
  const [newCoupon, setNewCoupon] = useState({ name: '', code: '' });

  // Dynamic transaction categories
  const categories = {
    deposit: ['Salary', 'Bonus', 'Returns', 'Others'],
    expense: ['Food', 'Shopping', 'Transport', 'Entertainment', 'Others']
  };

  // Track all transactions
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'incoming', amount: 5000, date: '2024-03-15', description: 'Salary' },
    { id: 2, type: 'outgoing', amount: 1500, date: '2024-03-16', description: 'Rent' },
    // Add more transactions as needed
  ]);

  // Initialize charts with default data
  const [expensesData, setExpensesData] = useState({
    labels: ['Food', 'Shopping', 'Transport', 'Entertainment', 'Others'],
    datasets: [{
      data: [300, 500, 200, 400, 300],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#FF9F40'
      ],
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 1,
    }]
  });

  const [depositsData, setDepositsData] = useState({
    labels: ['Salary', 'Bonus', 'Returns', 'Others'],
    datasets: [{
      data: [3000, 1000, 500, 200],
      backgroundColor: [
        '#00ff9d',
        '#00cc7d',
        '#009e5f',
        '#00815D'
      ],
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 1,
    }]
  });

  const cardsRef = useRef([]);

  const [netBalance, setNetBalance] = useState(0);
  const [totalIncoming, setTotalIncoming] = useState(0);
  const [totalOutgoing, setTotalOutgoing] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cards animation
      gsap.fromTo(cardsRef.current,
        {
          opacity: 0,
          scale: 0.9,
          y: 30
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.2)"
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // Update the charts when transactions change
  useEffect(() => {
    // Group expenses by category
    const expensesByCategory = transactions
      .filter(t => t.type === 'outgoing')
      .reduce((acc, curr) => {
        acc[curr.description] = (acc[curr.description] || 0) + curr.amount;
        return acc;
      }, {});

    // Group deposits by category
    const depositsByCategory = transactions
      .filter(t => t.type === 'incoming')
      .reduce((acc, curr) => {
        acc[curr.description] = (acc[curr.description] || 0) + curr.amount;
        return acc;
      }, {});

    // Update expenses chart data
    setExpensesData({
      labels: Object.keys(expensesByCategory),
      datasets: [{
        data: Object.values(expensesByCategory),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#FF9F40'
        ],
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
      }]
    });

    // Update deposits chart data
    setDepositsData({
      labels: Object.keys(depositsByCategory),
      datasets: [{
        data: Object.values(depositsByCategory),
        backgroundColor: [
          '#00ff9d',
          '#00cc7d',
          '#009e5f',
          '#00815D'
        ],
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
      }]
    });
  }, [transactions]);

  useEffect(() => {
    // Calculate all financial metrics
    const calculateBalances = () => {
      const incoming = transactions
        .filter(t => t.type === 'incoming')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const outgoing = transactions
        .filter(t => t.type === 'outgoing')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      setTotalIncoming(incoming);
      setTotalOutgoing(outgoing);
      setNetBalance(incoming - outgoing);
      setBalance(incoming - outgoing); // Update the displayed balance
    };

    calculateBalances();
  }, [transactions]);

  const handleAddMoney = (e) => {
    e.preventDefault();
    if (amount && !isNaN(amount) && transactionCategory) {
      const newAmount = parseFloat(amount);
      const newTransaction = {
        id: transactions.length + 1,
        type: transactionType === 'deposit' ? 'incoming' : 'outgoing',
        amount: newAmount,
        date: new Date().toISOString().split('T')[0],
        description: transactionCategory
      };
      
      // Add to transactions
      setTransactions(prev => [...prev, newTransaction]);

      // Update balance
      setBalance(prev => transactionType === 'deposit' ? 
        prev + newAmount : 
        prev - newAmount
      );

      // Reset form
      setAmount('');
      setTransactionCategory('');
      setShowAddMoney(false);
    }
  };

  const handleAddCrypto = (e) => {
    e.preventDefault();
    if (newCrypto.name && newCrypto.amount) {
      setCryptoList(prev => [...prev, newCrypto]);
      setNewCrypto({ name: '', amount: '' });
      setShowAddCrypto(false);
    }
  };

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (newCoupon.name && newCoupon.code) {
      setCouponList(prev => [...prev, {
        ...newCoupon,
        validTill: '31/12/2024' // Default validity
      }]);
      setNewCoupon({ name: '', code: '' });
      setShowAddCoupon(false);
    }
  };

  // Calculate totals for display
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDeposits = transactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          color: '#fff',
          font: {
            size: 12
          },
          padding: 20,
          usePointStyle: true
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <PageTransition>
      <div className="wallet-container">
        <div ref={el => cardsRef.current[0] = el} className="wallet-section">
          <div className="top-section">
            <div className="section-card money">
              <div className="money-header">
                <h3>Money</h3>
                <button 
                  className={`add-icon-btn ${showAddMoney ? 'active' : ''}`}
                  onClick={() => setShowAddMoney(!showAddMoney)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
              <div className="balance">
                <p>Current Balance</p>
                <h4>₹{balance.toFixed(2)}</h4>
              </div>
              
              {showAddMoney && (
                <div className="add-money-form">
                  <form onSubmit={handleAddMoney}>
                    <div className="transaction-type-selector">
                      <button
                        type="button"
                        className={`type-btn ${transactionType === 'deposit' ? 'active' : ''}`}
                        onClick={() => setTransactionType('deposit')}
                      >
                        Deposit
                      </button>
                      <button
                        type="button"
                        className={`type-btn ${transactionType === 'expense' ? 'active' : ''}`}
                        onClick={() => setTransactionType('expense')}
                      >
                        Expense
                      </button>
                    </div>
                    
                    <select
                      value={transactionCategory}
                      onChange={(e) => setTransactionCategory(e.target.value)}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories[transactionType].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>

                    <div className="input-container">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="form-buttons">
                      <button type="submit">Add {transactionType === 'deposit' ? 'Money' : 'Expense'}</button>
                      <button type="button" onClick={() => setShowAddMoney(false)}>Cancel</button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            <div className="section-card crypto">
              <div className="crypto-header">
                <h3>Crypto</h3>
                <button 
                  className={`add-icon-btn ${showAddCrypto ? 'active' : ''}`}
                  onClick={() => setShowAddCrypto(!showAddCrypto)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
              
              {showAddCrypto && (
                <div className="add-crypto-form">
                  <form onSubmit={handleAddCrypto}>
                    <input
                      type="text"
                      value={newCrypto.name}
                      onChange={(e) => setNewCrypto(prev => ({...prev, name: e.target.value}))}
                      placeholder="Enter cryptocurrency name"
                      required
                      autoFocus
                    />
                    <input
                      type="number"
                      value={newCrypto.amount}
                      onChange={(e) => setNewCrypto(prev => ({...prev, amount: e.target.value}))}
                      placeholder="Enter amount"
                      step="0.000001"
                      min="0"
                      required
                    />
                    <div className="form-buttons">
                      <button type="submit">Add Crypto</button>
                      <button type="button" onClick={() => setShowAddCrypto(false)}>Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="crypto-list">
                {cryptoList.map((crypto, index) => (
                  <div className="crypto-item" key={index}>
                    <div className="crypto-info">
                      <p>{crypto.name}</p>
                      <h4>{crypto.amount} {crypto.name.split(' ')[1]}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-card coupons">
              <div className="coupon-header">
                <h3>Coupons</h3>
                <button 
                  className={`add-icon-btn ${showAddCoupon ? 'active' : ''}`}
                  onClick={() => setShowAddCoupon(!showAddCoupon)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>

              {showAddCoupon && (
                <div className="add-coupon-form">
                  <form onSubmit={handleAddCoupon}>
                    <div className="input-container">
                      <input
                        type="text"
                        value={newCoupon.name}
                        onChange={(e) => setNewCoupon(prev => ({...prev, name: e.target.value}))}
                        placeholder="Enter coupon name"
                        autoFocus
                      />
                    </div>
                    <div className="input-container">
                      <input
                        type="text"
                        value={newCoupon.code}
                        onChange={(e) => setNewCoupon(prev => ({...prev, code: e.target.value}))}
                        placeholder="Enter coupon code"
                      />
                    </div>
                    <div className="form-buttons">
                      <button type="submit">Add Coupon</button>
                      <button type="button" onClick={() => setShowAddCoupon(false)}>Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="coupon-list">
                {couponList.map((coupon, index) => (
                  <div className="coupon-item" key={index}>
                    <div className="coupon-details">
                      <p className="coupon-name">{coupon.name}</p>
                      <p className="coupon-code">Code: {coupon.code}</p>
                      <span className="validity">Valid till: {coupon.validTill}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="analytics-section">
            <h2 className="analytics-title">Wallet Analytics</h2>
            
            <div className="charts-container">
              <div className="chart-card">
                <h3>Expenses Breakdown</h3>
                <div className="chart-wrapper">
                  <Pie data={expensesData} options={chartOptions} />
                </div>
                <div className="chart-total">
                  <p>Total Expenses</p>
                  <h4>₹{totalOutgoing.toLocaleString()}</h4>
                </div>
              </div>

              <div className="chart-card">
                <h3>Deposits Breakdown</h3>
                <div className="chart-wrapper">
                  <Pie data={depositsData} options={chartOptions} />
                </div>
                <div className="chart-total">
                  <p>Total Deposits</p>
                  <h4>₹{totalIncoming.toLocaleString()}</h4>
                </div>
              </div>
            </div>

            <div className="net-balance-container">
              <div className="net-balance-card">
                <div className="balance-header">
                  <FontAwesomeIcon icon={faWallet} />
                  <h3>Net Balance</h3>
                </div>
                <div className="balance-amount">
                  <span className={netBalance >= 0 ? 'positive' : 'negative'}>
                    {netBalance >= 0 ? '+' : '-'} ₹ {Math.abs(netBalance).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Wallet; 