/* START: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */
export interface FieldSchemaType {
  fieldName?: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "color"
    | "url"
    | "enum"
    | "datetime"
    | "file"
    | "files";
  required?: boolean;
  label?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: string[];
  fields?: FieldSchemaType[];
  item?: FieldSchemaType;
}
/* END: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */

export type ConfigurableSchemas = {
  formSchema: FieldSchemaType[];
};



export const configurableSchemas: ConfigurableSchemas = {
  formSchema: [
    // ── Identity ──────────────────────────────────────────────────────────
    {
      fieldName: "appName",
      type: "string",
      required: true,
      label: "Bakery Name",
      minLength: 1,
      maxLength: 80,
    },
    {
      fieldName: "tagline",
      type: "string",
      required: false,
      label: "Tagline",
      maxLength: 140,
    },
    {
      fieldName: "logoUrl",
      type: "url",
      required: true,
      label: "Logo URL",
    },
    // ── Brand colors (consumed by ConfigurablesCSSBridge) ────────────────
    {
      fieldName: "brandColor",
      type: "object",
      required: true,
      label: "Brand Colors",
      fields: [
        {
          fieldName: "primary",
          type: "color",
          required: true,
          label: "Primary (Crust Gold)",
        },
        {
          fieldName: "secondary",
          type: "color",
          required: true,
          label: "Secondary (Toasted Caramel)",
        },
        {
          fieldName: "accent",
          type: "color",
          required: true,
          label: "Accent (Butter Cream)",
        },
      ],
    },
    // ── Sold-today screen copy ───────────────────────────────────────────
    {
      fieldName: "soldTodayHeading",
      type: "string",
      required: false,
      label: "Sold Today Heading",
      maxLength: 60,
    },
    {
      fieldName: "soldTodaySubheading",
      type: "string",
      required: false,
      label: "Sold Today Subheading",
      maxLength: 140,
    },
    // ── Owner insight copy ───────────────────────────────────────────────
    {
      fieldName: "insightHeading",
      type: "string",
      required: false,
      label: "Insight Heading",
      maxLength: 60,
    },
    {
      fieldName: "insightSubheading",
      type: "string",
      required: false,
      label: "Insight Subheading",
      maxLength: 140,
    },
    // ── Auth screen copy ─────────────────────────────────────────────────
    {
      fieldName: "loginWelcome",
      type: "string",
      required: false,
      label: "Login Welcome Text",
      maxLength: 80,
    },
    // ── Feature flags ────────────────────────────────────────────────────
    {
      fieldName: "enableUndo",
      type: "boolean",
      required: false,
      label: "Show 10s undo toast after each tap",
    },
    {
      fieldName: "showBestsellerBadges",
      type: "boolean",
      required: false,
      label: "Show bestseller crowns on top 3",
    },
    // ── Layout ───────────────────────────────────────────────────────────
    {
      fieldName: "gridColumns",
      type: "number",
      required: false,
      label: "Pastry Grid Columns (tablet landscape)",
      min: 2,
      max: 5,
    },
    // ── Pastry catalog (seeded for first-run; editable per app) ──────────
    {
      fieldName: "defaultPastries",
      type: "array",
      required: false,
      label: "Default Pastry Catalog (seed)",
      item: {
        type: "object",
        required: true,
        fields: [
          { fieldName: "name", type: "string", required: true, label: "Pastry Name" },
          { fieldName: "photoUrl", type: "url", required: true, label: "Photo URL" },
          { fieldName: "emoji", type: "string", required: false, label: "Emoji Fallback" },
        ],
      },
    },
  ],
};
