// app/revoke-instagram/page.tsx

import React from 'react';

export default function RevokeInstagramPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">How to Revoke Instagram Access</h1>

      <p className="mb-4">
        Instagram does not currently allow developers to revoke access via API. However, you can manually remove the app's access to your Instagram account through your Facebook account settings (since Instagram is owned by Meta).
      </p>

      <h2 className="text-2xl font-semibold mb-2">Steps to Remove Access:</h2>
      <ol className="list-decimal list-inside mb-6 space-y-2">
        <li>
          Go to your <a
            href="https://www.instagram.com/accounts/manage_access/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Instagram access management
          </a>.
        </li>
        <li>Log in with the Instagram account linked.</li>
        <li>Find the name of our app in the list.</li>
        <li>Click the checkbox next to it, then click “Remove”.</li>
        <li>Confirm removal to revoke all permissions the app had.</li>
      </ol>

      <p className="text-gray-600">
        Once removed, our app will no longer have access to your Instagram account.
        <br />
        (Youtube allows us to automatically remove access so there is non need to do it for that)
      </p>
    </main>
  );
}
