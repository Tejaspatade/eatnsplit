import React, { useState } from "react";

const initialFriends = [
	{
		id: 118836,
		name: "Clark",
		image: "https://i.pravatar.cc/48?u=118836",
		balance: -7,
	},
	{
		id: 933372,
		name: "Sarah",
		image: "https://i.pravatar.cc/48?u=933372",
		balance: 20,
	},
	{
		id: 499476,
		name: "Anthony",
		image: "https://i.pravatar.cc/48?u=499476",
		balance: 0,
	},
];

const App = () => {
	// State
	const [showFriendForm, setShowFriendForm] = useState(false);
	const [friends, setFriends] = useState(initialFriends);
	const [selectedFriend, setSelectedFriend] = useState(null);

	// Handle Open/Close of friend info form
	const handleFriendForm = () => {
		setShowFriendForm((c) => !c);
	};

	// Handle Form Submit To Add New Friend
	const handleAddFriend = (newFriend) => {
		setFriends((f) => [...f, newFriend]);
		setShowFriendForm(false);
	};

	// Handle Selecting Friend
	const handleSelectedFriend = (friend) => {
		setSelectedFriend((selected) =>
			selected?.id === friend.id ? null : friend
		);
		setShowFriendForm(false);
	};

	// Handle Updating Friend Based on Bill Split
	const handleSplitBill = (value) => {
		setFriends((friends) =>
			friends.map((f) =>
				f.id === selectedFriend.id
					? { ...f, balance: f.balance + value }
					: f
			)
		);
		setSelectedFriend(null);
	};

	return (
		<div className="app">
			<div className="sidebar">
				<FriendList
					friends={friends}
					onFriendSelect={handleSelectedFriend}
					selectedFriend={selectedFriend}
				/>
				{showFriendForm && (
					<AddFriendForm
						isFormOpen={showFriendForm}
						onSubmit={handleAddFriend}
					/>
				)}
				<Button onClick={handleFriendForm}>
					{showFriendForm ? "Close" : "Add Friend"}
				</Button>
			</div>
			{selectedFriend && (
				<SplitBillForm
					friend={selectedFriend}
					onSplitBill={handleSplitBill}
					key={selectedFriend.id}
				/>
			)}
		</div>
	);
};

const FriendList = ({ friends, selectedFriend, onFriendSelect }) => {
	return (
		<ul>
			{friends.map((f) => (
				<Friend
					friend={f}
					key={f.id}
					onFriendSelect={onFriendSelect}
					selectedFriend={selectedFriend}
				/>
			))}
		</ul>
	);
};

const Friend = ({ friend, selectedFriend, onFriendSelect }) => {
	const isSelected = friend.id === selectedFriend?.id;
	return (
		<li className={isSelected ? "selected" : ""}>
			<img src={friend.image} alt={friend.name} />
			<h3>{friend.name}</h3>
			{friend.balance === 0 ? (
				<p>You and {friend.name} are even</p>
			) : friend.balance > 0 ? (
				<p className="green">
					{friend.name} owes you {friend.balance}
				</p>
			) : (
				<p className="red">
					You owe {friend.name} {friend.balance}
				</p>
			)}
			<Button onClick={() => onFriendSelect(friend)}>
				{isSelected ? "Close" : "Select"}
			</Button>
		</li>
	);
};

const AddFriendForm = ({ onSubmit }) => {
	// State for controlled form elements
	const [name, setName] = useState("");
	const [image, setImage] = useState("https://i.pravatar.cc/48");

	const handleSubmit = (e) => {
		e.preventDefault();

		// Guard Clause
		if (!name || !image) return;

		// Creating New Friend obj
		const id = crypto.randomUUID();
		const newFriend = {
			name,
			image: `${image}${id}`,
			balance: 0,
			id,
		};

		// Add Friend to state(lifted up to App component)
		onSubmit(newFriend);

		// Go back to default values on controlled elements
		setImage("https://i.pravatar.cc/48");
		setName("");
	};

	return (
		<form className="form-add-friend" onSubmit={handleSubmit}>
			<label>🙍🏼 Friend name</label>
			<input
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			<label>🖼️ Image Url</label>
			<input
				type="text"
				value={image}
				onChange={(e) => setImage(e.target.value)}
			/>
			<Button>Add</Button>
		</form>
	);
};

const SplitBillForm = ({ friend, onSplitBill }) => {
	// State for controllec form elements
	const [bill, setBill] = useState("");
	const [userCost, setUserCost] = useState("");
	const [whosPaying, setWhosPaying] = useState("user");

	// Derived state
	const friendCost = bill ? bill - userCost : "";

	// Handle Form Submit
	const handleSubmit = (e) => {
		e.preventDefault();

		// Guard Clause
		if (!bill || !userCost) return;

		// Update the friend dues
		onSplitBill(whosPaying === "user" ? friendCost : -userCost);

		// Close the form
	};

	return (
		<form className="form-split-bill" onSubmit={handleSubmit}>
			<h2>Splitting Bill With {friend.name}</h2>
			<label>💳 Bill Value</label>
			<input
				type="text"
				value={bill}
				onChange={(e) => setBill(Number(e.target.value))}
			/>
			<label>🙋🏼 Your Expense</label>
			<input
				type="text"
				value={userCost}
				onChange={(e) =>
					setUserCost(
						Number(e.target.value) > bill
							? userCost
							: Number(e.target.value)
					)
				}
			/>
			<label>🤵🏼 {friend.name}'s Expense</label>
			<input type="text" disabled value={friendCost} />
			<label>🤑 Who's Paying The Bill?</label>
			<select
				value={whosPaying}
				onChange={(e) => setWhosPaying(e.target.value)}
			>
				<option value="user">You</option>
				<option value="friend">{friend.name}</option>
			</select>
			<Button>Add</Button>
		</form>
	);
};

const Button = ({ children, onClick }) => {
	return (
		<button className="button" onClick={onClick}>
			{children}
		</button>
	);
};

export default App;
