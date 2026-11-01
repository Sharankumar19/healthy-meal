import {
  LegalHeader,
  LegalList,
  LegalSection,
} from "@/components/legal/LegalBlocks";

export const metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <article>
      <LegalHeader
        eyebrow="Terms of Service"
        title="The ground rules, in plain language."
        updated="Last updated 1 November 2026"
        intro="Healthy Meal is a demonstration product built to show a personalised nutrition experience. These terms explain what this demo does, what it does not do, and how you should treat the information it shows."
      />

      <LegalSection title="1. This is a demo, not a clinic">
        <p>
          Every calorie target, macro split, BMI reading and meal suggestion in
          this app is a general estimate produced from the details you enter.
          Nothing here is medical advice, a diagnosis or a treatment plan, and
          using the app does not create a doctor–patient relationship.
        </p>
        <p>
          If you are pregnant, managing a medical condition, taking medication
          or recovering from an eating disorder, speak to a qualified
          professional before changing how you eat.
        </p>
      </LegalSection>

      <LegalSection title="2. If you are under 18">
        <p>
          The app deliberately avoids restrictive calorie targets for anyone
          under 18 and does not recommend intentional weight-loss deficits for
          minors. Please use it with a parent or guardian, and treat the numbers
          as rough educational estimates rather than goals to chase.
        </p>
      </LegalSection>

      <LegalSection title="3. Your account and access">
        <LegalList
          items={[
            "Phone verification is simulated. The demo code is shown on screen and no SMS is sent.",
            "Your session lives in this browser's local storage. Anyone with access to this device and browser can open it.",
            "Please do not enter sensitive personal, financial or health records. A name, phone number and basic body details are enough for the demo.",
            "You can clear everything at any time with “Sign out & reset demo” in the profile menu.",
          ]}
        />
      </LegalSection>

      <LegalSection title="4. Meals, plans and pricing">
        <p>
          The menu is sample content. Prices, delivery promises and membership
          details are illustrative and are not an offer to sell. No order is
          placed, no payment is collected and no food is delivered through this
          build.
        </p>
        <p>
          Meal plans are generated deterministically from the sample menu to
          match your diet preference and goal. Swapping meals and marking them
          eaten only changes the demo state stored on your device.
        </p>
      </LegalSection>

      <LegalSection title="5. The assistant">
        <p>
          The chat assistant is a local, rule-based demo — not a live AI model
          and not a nutritionist. Its replies can be incomplete or wrong. Do not
          rely on them for medical, allergy or dietary-safety decisions.
        </p>
      </LegalSection>

      <LegalSection title="6. Acceptable use">
        <LegalList
          items={[
            "Use the demo for personal exploration and evaluation.",
            "Do not use it to provide medical or nutrition advice to other people.",
            "Do not attempt to disrupt the app or misrepresent it as a clinical service.",
          ]}
        />
      </LegalSection>

      <LegalSection title="7. Availability and changes">
        <p>
          This is a demo build provided as-is, without warranties or an uptime
          promise. Features, copy, menus and these terms may change as the
          experience evolves.
        </p>
      </LegalSection>

      <LegalSection title="8. Contact">
        <p>
          This demo has no live support inbox. For questions about how your data
          behaves, see the Privacy Policy or clear your local data from the
          profile menu.
        </p>
      </LegalSection>
    </article>
  );
}
