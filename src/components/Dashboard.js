// src/components/Dashboard.js
import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import '../App.css'; // Adjusted path to go up one level to src

 // Ensure you import the CSS file

function Dashboard() {
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState({
    household: "",
    travelling: "",
    weekend: "",
    other: "",
  });
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      console.log(user); // Check if user is logged in
      await addDoc(collection(db, "income-tracker"), {
        uid: user.uid,
        income,
        expenses,
      });
      alert("Data submitted successfully!");
    } catch (error) {
      console.log("Error saving data:", error); // Log the error to see details
      alert("Error saving data: " + error.message);
    }
  };
  

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      const q = query(collection(db, "income-tracker"), where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const fetchedData = querySnapshot.docs.map(doc => doc.data());
      setUserData(fetchedData);
    } catch (error) {
      alert("Error fetching data: " + error.message);
    }
  };

  const calculateComparison = () => {
    const totalExpenses = userData.reduce((acc, entry) => {
      return acc + parseFloat(entry.expenses.household || 0) +
                  parseFloat(entry.expenses.travelling || 0) +
                  parseFloat(entry.expenses.weekend || 0) +
                  parseFloat(entry.expenses.other || 0);
    }, 0);
    
    const totalIncome = userData.reduce((acc, entry) => acc + parseFloat(entry.income || 0), 0);

    return { totalExpenses, totalIncome };
  };

  const { totalExpenses, totalIncome } = calculateComparison();

  return (
    <div>
      <h2>Income and Expense Tracker</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Monthly Income"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
        />
        <input
          type="number"
          placeholder="Household Expenses"
          value={expenses.household}
          onChange={(e) =>
            setExpenses({ ...expenses, household: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Travelling Expenses"
          value={expenses.travelling}
          onChange={(e) =>
            setExpenses({ ...expenses, travelling: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Weekend Expenses"
          value={expenses.weekend}
          onChange={(e) =>
            setExpenses({ ...expenses, weekend: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Other Expenses"
          value={expenses.other}
          onChange={(e) => setExpenses({ ...expenses, other: e.target.value })}
        />
        <button type="submit">Submit</button>
      </form>
      <button onClick={() => navigate("/")}>Back to Login</button>
      <button onClick={fetchUserData}>View My Data</button>
      
      {userData.length > 0 && (
        <div className="user-data">
          <h3>Your Submitted Data:</h3>
          {userData.map((entry, index) => (
            <div key={index} className="data-entry">
              <p><strong>Monthly Income:</strong> {entry.income}</p>
              <p><strong>Household Expenses:</strong> {entry.expenses.household}</p>
              <p><strong>Travelling Expenses:</strong> {entry.expenses.travelling}</p>
              <p><strong>Weekend Expenses:</strong> {entry.expenses.weekend}</p>
              <p><strong>Other Expenses:</strong> {entry.expenses.other}</p>
            </div>
          ))}
          <hr />
          <h4>Total Income: {totalIncome}</h4>
          <h4>Total Expenses: {totalExpenses}</h4>
          <h4 className={`status ${totalIncome >= totalExpenses ? "status-within" : "status-overspending"}`}>
            Status: {totalIncome >= totalExpenses ? "Within Budget" : "Overspending"}
          </h4>
        </div>
      )}
    </div>
  );
}

export default Dashboard;