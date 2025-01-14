export const initialConversations = [
    {
        id: 1, name: 'Matt Black', lastMessage: 'I need the reports as well', date: '19/10/20', unread: true, unreadCount: 3, messages: [
            {
                id: 1, senderId: 2, receiverId: 1, text: 'Hi! I’m looking for the reports from the last meeting...', time: '12:56 PM', senderName: "You",
                senderImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverName: "Matt Black"
            },
            {
                id: 2, senderId: 1, receiverId: 2, text: 'I need the reports as well', time: '12:55 PM',
                senderImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverName: "You"
            },
            {
                id: 3, senderId: 1, receiverId: 2, text: 'Thanks', time: '12:56 PM',
                senderImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverName: "You"

            }
        ]
    },
    {
        id: 2, name: 'Design Team', lastMessage: "I haven't really looked into the file yet", date: '19/10/20', unread: false, unreadCount: 0, messages: [
            {
                id: 1, senderId: 2, receiverId: 1, text: 'We need to finalize the design by tomorrow', time: '3:45 PM',
                senderImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverName: "You"

            },
            {
                id: 2, senderId: 1, receiverId: 2, text: 'I’m on it', time: '4:00 PM',
                senderImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverName: "Matt Black"

            },
            {
                id: 3, senderId: 1, receiverId: 2, text: 'Thanks', time: '4:01 PM',
                senderImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverName: "You"
            }
        ]
    },
    {
        id: 3, name: 'Dev Team', lastMessage: 'I looked into the file yet', date: '01/08/24', unread: false, unreadCount: 0, messages: [
            {
                id: 1, senderId: 2, receiverId: 1, text: 'Can you review the code changes?', time: '2:30 PM',
                senderImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverName: "You"
            },
            {
                id: 2, senderId: 1, receiverId: 2, text: 'I looked into the file yet', time: '2:45 PM',
                senderImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverName: "Matt Black"
            }
        ]
    },
    {
        id: 4, name: 'Manager Team', lastMessage: 'nicw', date: '19/07/24', unread: false, unreadCount: 0, messages: [
            {
                id: 1, senderId: 2, receiverId: 1, text: 'Great work on the project!', time: '11:00 AM',
                senderImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverName: "You"
            },
            {
                id: 2, senderId: 1, receiverId: 2, text: 'Thanks!', time: '11:15 AM',
                senderImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverName: "Matt Black"
            }
        ]
    },
    {
        id: 5, name: 'Team Lead', lastMessage: 'I will check', date: '29/07/24', unread: true, unreadCount: 1, messages: [
            {
                id: 1, senderId: 2, receiverId: 1, text: 'Can you update the task status?', time: '9:00 AM',
                senderImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverName: "You"
            },
            {
                id: 2, senderId: 1, receiverId: 2, text: 'I will check', time: '9:05 AM',
                senderImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverName: "Matt Black"
            },
            {
                id: 3, senderId: 1, receiverId: 2, text: 'Thanks', time: '9:06 AM',
                senderImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverName: "Matt Black"
            }
        ]
    },
    {
        id: 6, name: 'HR', lastMessage: 'Please submit your documents', date: '30/07/24', unread: true, unreadCount: 1, messages: [
            {
                id: 1, senderId: 2, receiverId: 1, text: 'Please submit your documents for verification', time: '10:00 AM',
                senderImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverName: "You"
            },
            {
                id: 2, senderId: 1, receiverId: 2, text: 'Will do', time: '10:05 AM',
                senderImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverName: "Matt Black"
            },
            {
                id: 3, senderId: 1, receiverId: 2, text: 'Thanks', time: '10:06 AM',
                senderImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                receiverName: "Matt Black"
            }
        ]
    },
    {
        id: 7, name: 'Finance Dept', lastMessage: 'The budget has been approved', date: '15/06/24', unread: false, unreadCount: 0, messages: [
            { id: 1, senderId: 2, receiverId: 1, text: 'The budget has been approved for the next quarter', time: '2:00 PM' },
            { id: 2, senderId: 1, receiverId: 2, text: 'Great news!', time: '2:15 PM' }
        ]
    },
    {
        id: 8, name: 'John Doe', lastMessage: "Let's meet tomorrow", date: '12/05/24', unread: true, unreadCount: 1, messages: [
            { id: 1, senderId: 2, receiverId: 1, text: "Let's meet tomorrow to discuss the project", time: '1:00 PM' },
            { id: 2, senderId: 1, receiverId: 2, text: 'Sure, what time?', time: '1:05 PM' }
        ]
    },
    {
        id: 9, name: 'Marketing Team', lastMessage: 'Campaign starts next week', date: '07/08/24', unread: false, unreadCount: 0, messages: [
            { id: 1, senderId: 2, receiverId: 1, text: 'Campaign starts next week, are we ready?', time: '4:00 PM' },
            { id: 2, senderId: 1, receiverId: 2, text: 'Yes, everything is set', time: '4:15 PM' }
        ]
    },
    {
        id: 10, name: 'Jane Smith', lastMessage: 'Check the attachment', date: '05/04/24', unread: false, unreadCount: 0, messages: [
            { id: 1, senderId: 2, receiverId: 1, text: 'Check the attachment for the details', time: '2:00 PM' },
            { id: 2, senderId: 1, receiverId: 2, text: 'Got it, thanks', time: '2:05 PM' }
        ]
    },
    {
        id: 11, name: 'Support', lastMessage: 'Issue resolved', date: '08/07/24', unread: true, unreadCount: 1, messages: [
            { id: 1, senderId: 2, receiverId: 1, text: 'Issue resolved, please verify', time: '3:00 PM' },
            { id: 2, senderId: 1, receiverId: 2, text: 'Will do', time: '3:05 PM' }
        ]
    },
    {
        id: 12, name: 'Sales Team', lastMessage: 'Target achieved', date: '01/03/24', unread: false, unreadCount: 0, messages: [
            { id: 1, senderId: 2, receiverId: 1, text: 'We have achieved our target for the month', time: '5:00 PM' },
            { id: 2, senderId: 1, receiverId: 2, text: 'Fantastic!', time: '5:05 PM' }
        ]
    },
    {
        id: 13, name: 'Product Team', lastMessage: 'New feature deployed', date: '11/06/24', unread: false, unreadCount: 0, messages: [
            { id: 1, senderId: 2, receiverId: 1, text: 'New feature deployed, please test', time: '10:00 AM' },
            { id: 2, senderId: 1, receiverId: 2, text: 'Testing it now', time: '10:15 AM' }
        ]
    },
    {
        id: 14, name: 'Client A', lastMessage: 'Contract signed', date: '19/02/24', unread: false, unreadCount: 0, messages: [
            { id: 1, senderId: 2, receiverId: 1, text: 'Contract signed and sent to you', time: '3:00 PM' },
            { id: 2, senderId: 1, receiverId: 2, text: 'Received, thanks!', time: '3:05 PM' }
        ]
    },
    {
        id: 15, name: 'Client B', lastMessage: 'Awaiting feedback', date: '27/07/24', unread: true, unreadCount: 1, messages: [
            { id: 1, senderId: 2, receiverId: 1, text: 'Awaiting feedback on the proposal', time: '4:00 PM' },
            { id: 2, senderId: 1, receiverId: 2, text: 'Will review it soon', time: '4:05 PM' }
        ]
    },
    {
        id: 16, name: 'Operations Team', lastMessage: 'Update on project status', date: '29/07/24', unread: true, unreadCount: 1, messages: [
            { id: 1, senderId: 2, receiverId: 1, text: 'Update on project status: on track', time: '11:00 AM' },
            { id: 2, senderId: 1, receiverId: 2, text: 'Good to hear', time: '11:05 AM' }
        ]
    },
    {
        id: 17, name: 'Admin', lastMessage: 'Maintenance scheduled', date: '22/07/24', unread: false, unreadCount: 0, messages: [
            { id: 1, senderId: 2, receiverId: 1, text: 'Maintenance scheduled for tonight', time: '6:00 PM' },
            { id: 2, senderId: 1, receiverId: 2, text: 'Noted, thanks', time: '6:05 PM' }
        ]
    },
    {
        id: 18, name: 'Legal Dept', lastMessage: 'Review the document', date: '30/06/24', unread: false, unreadCount: 0, messages: [
            { id: 1, senderId: 2, receiverId: 1, text: 'Please review the document and sign', time: '9:00 AM' },
            { id: 2, senderId: 1, receiverId: 2, text: 'Will do', time: '9:05 AM' }
        ]
    },
    {
        id: 19, name: 'Bob White', lastMessage: "Call me when you're free", date: '21/06/24', unread: true, unreadCount: 1, messages: [
            { id: 1, senderId: 2, receiverId: 1, text: "Call me when you're free", time: '1:00 PM' },
            { id: 2, senderId: 1, receiverId: 2, text: 'Sure, will call you soon', time: '1:05 PM' }
        ]
    },
    {
        id: 20, name: 'Alice Blue', lastMessage: 'Meeting postponed', date: '14/07/24', unread: false, unreadCount: 0, messages: [
            { id: 1, senderId: 2, receiverId: 1, text: 'Meeting postponed to next week', time: '3:00 PM' },
            { id: 2, senderId: 1, receiverId: 2, text: 'Got it', time: '3:05 PM' }
        ]
    },
    {
        id: 21, name: 'Project X Team', lastMessage: 'Deadline extended', date: '03/08/24', unread: false, unreadCount: 0, messages: [
            { id: 1, senderId: 2, receiverId: 1, text: 'Deadline extended by one week', time: '4:00 PM' },
            { id: 2, senderId: 1, receiverId: 2, text: 'Understood', time: '4:05 PM' },
            { id: 3, senderId: 1, receiverId: 2, text: 'thank you', time: '4:06 PM' },
            { id: 4, senderId: 2, receiverId: 1, text: 'Happy to help', time: '4:07 PM' }
        ]
    },
    {
        id: 22, name: 'DevOps Team', lastMessage: 'Server update complete', date: '02/07/24', unread: true, unreadCount: 1, messages: [
            { id: 1, senderId: 2, receiverId: 1, text: 'Server update complete', time: '8:00 PM' },
            { id: 2, senderId: 1, receiverId: 2, text: 'Thanks for the update', time: '8:05 PM' },
            { id: 3, senderId: 2, receiverId: 1, text: 'Right!', time: '8:07 PM' },
            { id: 4, senderId: 1, receiverId: 2, text: 'Happy to help', time: '8:08 PM' }
        ]
    },
    {
        id: 23, name: 'QA Team', lastMessage: 'All tests passed', date: '18/06/24', unread: false, unreadCount: 0, messages: [
            { id: 1, senderId: 2, receiverId: 1, text: 'All tests passed, ready for deployment', time: '2:00 PM' },
            { id: 2, senderId: 1, receiverId: 2, text: 'Deploying now', time: '2:05 PM' }
        ]
    },
    {
        id: 24, name: 'Client C', lastMessage: 'Invoice received', date: '01/08/24', unread: true, unreadCount: 1, messages: [
            { id: 1, senderId: 2, receiverId: 1, text: 'Invoice received, thank you', time: '10:00 AM' },
            { id: 2, senderId: 1, receiverId: 2, text: 'You’re welcome', time: '10:05 AM' }
        ]
    },
    {
        id: 25, name: 'Client D', lastMessage: 'Pending approval', date: '25/07/24', unread: false, unreadCount: 0, messages: [
            { id: 1, senderId: 2, receiverId: 1, text: 'Pending approval, should be done by EOD', time: '3:00 PM' },
            { id: 2, senderId: 1, receiverId: 2, text: 'Got it, waiting for confirmation', time: '3:05 PM' }
        ]
    }
];
