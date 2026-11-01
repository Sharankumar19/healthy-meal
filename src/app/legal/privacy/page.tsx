import {
  LegalHeader,
  LegalList,
  LegalSection,
} from "@/components/legal/LegalBlocks";

export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <article>
      <LegalHeader
        eyebrow="Privacy Policy"
        title="Your data stays in this browser."
        updated="Last updated 1 November 2026"
        intro="Healthy Meal is a self-contained demo. There is no backend account, no analytics pipeline and no external AI service in this build. This page explains exactly what is stored and where."
      />

      <LegalSection title="What the app stores">
        <LegalList
          items={[
            "Your phone number, as entered during demo verification.",
            "Your profile: name, gender, age, height, weight, activity level, goal, food preference and meals-per-day choice.",
            "Your generated weekly meal plan and any meals you swap.",
            "Daily tracking: meals marked eaten, extra meals added from the menu, and water intake.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Where it lives">
        <p>
          All of the above is saved in this browser&apos;s{" "}
          <code className="rounded bg-cream-deep px-1.5 py-0.5 text-[0.72rem] text-forest">
            localStorage
          </code>{" "}
          under the key{" "}
          <code className="rounded bg-cream-deep px-1.5 py-0.5 text-[0.72rem] text-forest">
            healthy-meal:user:v1
          </code>
          . It is not transmitted to a server, synced between devices or shared
          with third parties.
        </p>
        <p>
          A small session flag is also stored in{" "}
          <code className="rounded bg-cream-deep px-1.5 py-0.5 text-[0.72rem] text-forest">
            sessionStorage
          </code>{" "}
          so loading skeletons only appear on your first visit to a screen in a
          session.
        </p>
      </LegalSection>

      <LegalSection title="Phone verification">
        <p>
          Verification is simulated. The demo code 2468 is displayed in the app
          and no SMS is sent. Your phone number is stored locally only to
          personalise the session — it is never used for messaging or marketing.
        </p>
      </LegalSection>

      <LegalSection title="The chat assistant">
        <p>
          The assistant runs entirely inside the page using built-in rules
          rather than an external language model. Your messages are kept in
          memory for the current tab and are not persisted; refreshing the page
          or clearing the conversation removes them.
        </p>
      </LegalSection>

      <LegalSection title="Cookies, analytics and advertising">
        <p>
          This demo sets no advertising or analytics cookies and includes no
          third-party trackers. Fonts are bundled by the framework rather than
          requested from a third-party font service at runtime.
        </p>
      </LegalSection>

      <LegalSection title="Your choices">
        <LegalList
          items={[
            "Open the profile menu and choose “Sign out & reset demo” to delete the saved profile, plan and tracking data from this browser.",
            "Clearing site data in your browser settings removes everything, including the session flag.",
            "Updating your details in onboarding replaces your profile and regenerates the plan.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Under 18">
        <p>
          If you are under 18, please use the demo with a parent or guardian.
          The app avoids restrictive calorie targets for minors and treats all
          estimates as educational rather than prescriptive.
        </p>
      </LegalSection>

      <LegalSection title="Changes and contact">
        <p>
          Because this is a demo, the data model may change as the experience
          evolves. There is no live support inbox; if you need to remove your
          data, use the reset option in the profile menu or clear this
          site&apos;s storage in your browser.
        </p>
      </LegalSection>
    </article>
  );
}
