import { MainLayout } from "@/widgets";
import React, { FC } from "react";

const Features: FC = () => {
  return (
    <MainLayout defaultContainer={true}>
      <h2>Features</h2>
      <span>
        <p>Welcome to Stellar Multisig, the platform designed to enhance your experience with Stellar. Explore the key features we offer:</p>

        <h3>1. Full Account Information Access</h3>
        <ul>
          <li>View comprehensive details about any Stellar account, including signers, thresholds, assets, and more.</li>
        </ul>

        <h3>2. Multisignature Transaction Creation and Management</h3>
        <ul>
          <li>Easily initiate transactions that require multiple signers.</li>
          <li>Automatically notify all signers for approval and track the process.</li>
        </ul>

        <h3>3. Real-Time Transaction Alerts</h3>
        <ul>
          <li>Get sound and visual notifications the moment a transaction needs your signature, ensuring you never miss an important action.</li>
        </ul>

        <h3>4. Multiple Account Management</h3>
        <ul>
          <li>Seamlessly operate and manage multiple Stellar accounts from a single, user-friendly dashboard.</li>
        </ul>

        <h3>5. Automated Transaction Formation via Data Entries</h3>
        <ul>
          <li>Automatically generate transactions based on Data Entries, similar to smart contracts, with options to calculate signer weights using linear or logarithmic models.</li>
          <li>These pre-formed transactions simplify processes like adjusting signer weights but still require multisignature approval.</li>
        </ul>

        <h3>6. Clear View of Data Entries</h3>
        <ul>
          <li>View Data Entries in a clear, easy-to-understand format for better control and decision-making.</li>
        </ul>

        <h3>7. Trusted MTL Assets</h3>
        <ul>
          <li>Discover trusted MTL assets related to the Montelibero movement on the dedicated “Assets” page.</li>
          <li>Requests for changes to the trusted MTL assets list are accepted via pull requests in our repository.</li>
        </ul>

        <h3>8. Stellar Network Support (Public & Testnet)</h3>
        <ul>
          <li>Switch effortlessly between the Stellar test network for experimentation and the public network for real transactions.</li>
        </ul>

        <h3>9. Firebase Integration for Secure Transaction Storage</h3>
        <ul>
          <li>Connect a private Firebase database to securely store your multisignature transactions and share access only with your trusted team.</li>
        </ul>

        <h3>10. Open Source and Independent Setup</h3>
        <ul>
          <li>Stellar Multisig is an open-source project. You can review the entire codebase, verify its functionality, and contribute improvements through pull requests.</li>
          <li>You can also download the code locally from the repository and run it with your own Firebase database, allowing you to be fully independent from the current website and domain.</li>
        </ul>

        <p>Ready to simplify and secure your Stellar experience? Explore these features today and get the most out of Stellar Multisig for streamlined account management.</p>
      </span>
    </MainLayout>
  );
};

export default Features;
